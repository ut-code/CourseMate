use anyhow::anyhow;
use lazy_static::lazy_static;
use scraper::{Html, Selector};

use crate::types::*;

lazy_static! {
    static ref NAME_SELECTOR: Selector =
        Selector::parse(".catalog-page-detail-table-cell.name-cell").unwrap();
    static ref TEACHER_SELECTOR: Selector =
        Selector::parse(".catalog-page-detail-table-cell.lecturer-cell").unwrap();
    static ref SEMESTER_SELECTOR: Selector =
        Selector::parse(".catalog-page-detail-table-cell.semester-cell").unwrap();
    static ref PERIOD_SELECTOR: Selector =
        Selector::parse(".catalog-page-detail-table-cell.period-cell").unwrap();
    static ref CODE_SELECTOR: Selector =
        Selector::parse(".catalog-page-detail-table-cell.code-cell").unwrap();
}

pub fn parse_course_info(html: Html) -> anyhow::Result<Course> {
    Ok(Course {
        name: select(&html, &NAME_SELECTOR, 1)?,
        teacher: select(&html, &TEACHER_SELECTOR, 1)?,
        semester: select_all(&html, &SEMESTER_SELECTOR, 1)?,
        period: select(&html, &PERIOD_SELECTOR, 1)?,
        code: select(&html, &CODE_SELECTOR, 1)?,
    })
}

fn select(html: &Html, selector: &Selector, nth: usize) -> anyhow::Result<String> {
    html.select(selector)
        .nth(nth)
        .ok_or(anyhow!(
            "Couldn't find matching element for selector {:?}",
            selector,
        ))
        .map(|val| val.text().next().unwrap().trim().to_owned())
}

fn select_all(html: &Html, selector: &Selector, nth: usize) -> anyhow::Result<String> {
    html.select(selector)
        .nth(nth)
        .ok_or(anyhow!(
            "Couldn't find matching element for selector {:?}",
            selector,
        ))
        .map(|val| {
            val.text()
                .map(|text| text.trim())
                .collect::<Vec<_>>()
                .join(" ")
        })
}
