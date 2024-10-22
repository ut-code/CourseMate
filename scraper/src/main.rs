mod io;
mod logger;
mod parser;
mod types;
mod urls;

use lazy_static::lazy_static;
use std::time::Duration;
use tokio::{fs, io::AsyncWriteExt};

use anyhow::Context;
use tokio::time::sleep;
use types::*;

use scraper::{Html, Selector};
use urls::URLS;

const RESULT_FILE: &str = "./data.json";
const CACHE_DIR: &str = "./.cache";
const CACHE_GITKEEP: &str = "./.cache/.gitkeep";

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    println!("[log] starting...");

    let _ = fs::DirBuilder::new().create(CACHE_DIR).await;
    let _ = fs::File::create(CACHE_GITKEEP).await;

    let mut file = fs::File::create(RESULT_FILE)
        .await
        .expect("Failed to create file");
    file.write_all("[".as_bytes()).await.unwrap();

    let total = URLS.len();
    let mut logger = logger::Logger::new(total);
    for (faculty_name, base_url) in URLS {
        let courses = get_courses_of(base_url).await;
        logger.done(faculty_name);
        let result = Entry {
            name: faculty_name.to_owned(),
            courses,
        };
        io::write_to(&mut file, result).await.unwrap();
        file.write_all(",".as_bytes()).await.unwrap();
    }

    file.write_all("]".as_bytes()).await.unwrap();
    logger.close().unwrap();
}

async fn get_courses_of(base_url: &str) -> Vec<Course> {
    let courses = page_index_pages(base_url)
        .await
        .into_iter()
        .map(|content_page_url| async {
            let html = scrape(&content_page_url).await;
            parser::parse_course_info(html)
                .context(content_page_url)
                .unwrap()
        });
    futures::future::join_all(courses)
        .await
        .into_iter()
        .collect::<Vec<_>>()
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
