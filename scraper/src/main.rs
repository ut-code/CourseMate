mod io;
mod parser;
mod types;
mod urls;

use lazy_static::lazy_static;
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

    let start_ms = chrono::Local::now().timestamp_millis();
    let start_sec = chrono::Local::now().timestamp();
    let start_min = chrono::Local::now().timestamp() / 60;

    let mut result: Vec<Entry> = Vec::new();
    let mut count = 0;
    let total = URLS.len();
    for (faculty_name, base_url) in URLS {
        let courses = page_index_pages(base_url)
            .await
            .into_iter()
            .map(|content_page_url| async {
                let html = scrape(&content_page_url).await;
                parser::parse_course_info(html)
                    .context(content_page_url)
                    .unwrap()
            });
        let courses = futures::future::join_all(courses)
            .await
            .into_iter()
            .collect::<Vec<_>>();

        let now_ms = chrono::Local::now().timestamp_millis();
        let now_sec = chrono::Local::now().timestamp();
        let now_min = now_sec / 60;
        count += 1;
        println!(
            "[log] faculty {faculty_name} done. ({count} / {total}) timestamp: {}ms / {}sec / {}min",
            now_ms - start_ms,
            now_sec - start_sec,
            now_min - start_min
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

lazy_static! {
    static ref DETAIL_BUTTONS: Selector =
        Selector::parse(".catalog-search-result-card-header-detail-link")
            .expect("invalid selector");
}
const BASE_URL: &str = "https://catalog.he.u-tokyo.ac.jp/";

async fn page_index_pages(base_url: &str) -> Vec<String> {
    let mut urls: Vec<String> = Vec::new();
    for key in 0.. {
        let html = scrape(&format!("{}{}", base_url, key)).await;
        if html.select(&DETAIL_BUTTONS).next().is_none() {
            break;
        }
        urls.extend(
            html.select(&DETAIL_BUTTONS)
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
