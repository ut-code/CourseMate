mod io;
mod parser;
pub mod types;
mod urls;
use std::time::Duration;
use tokio::fs;

use anyhow::Context;
use tokio::time::sleep;
use types::*;

use scraper::{Html, Selector};
use urls::URLS;

#[tokio::main]
async fn main() {
    println!("[log] starting...");

    let _ = fs::DirBuilder::new().create("./.cache").await;
    let _ = fs::File::create("./.cache/.gitkeep").await;

    let start = chrono::Local::now().timestamp_millis();
    let mut result: Vec<Entry> = Vec::new();
    let mut count = 0;
    let total = URLS.len();
    for (faculty_name, base_url) in URLS {
        let courses = futures::future::join_all(page_index_pages(base_url).await.into_iter().map(
            |url| async {
                let result = scrape(&url).await;
                (url, result)
            },
        ))
        .await
        .into_iter()
        .map(|(url, html)| parser::parse_course_info(html).context(url).unwrap())
        .collect::<Vec<_>>();

        let now = chrono::Local::now().timestamp_millis();
        count += 1;
        println!(
            "[log] faculty {faculty_name} done. ({count} / {total}) timestamp: {}ms",
            now - start
        );

        result.push(Entry {
            name: faculty_name.to_owned(),
            courses,
        });
    }

    io::write_file("./data.json", result)
        .await
        .expect("failed to write to file");
}

const BASE_URL: &str = "https://catalog.he.u-tokyo.ac.jp/";
async fn page_index_pages(base_url: &str) -> Vec<String> {
    let mut urls: Vec<String> = Vec::new();
    for key in 0.. {
        let html = scrape(&format!("{}{}", base_url, key)).await;
        let selector = Selector::parse(".catalog-search-result-card-header-detail-link")
            .expect("invalid selector");
        if html.select(&selector).next().is_none() {
            break;
        }
        urls.extend(
            html.select(&selector)
                .map(|elem| BASE_URL.to_owned() + elem.attr("href").unwrap()),
        );
    }
    urls
}

async fn scrape(url: &str) -> Html {
    for tries in 0..10 {
        let res = io::request(url).await;
        match res {
            Ok(val) => return Html::parse_document(&val),
            Err(err) => {
                eprintln!("request error: {err} for {} times", tries + 1);
                sleep(Duration::from_millis(200)).await;
            }
        }
    }
    panic!("Request failed too many times");
}
