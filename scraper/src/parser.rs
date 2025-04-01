use anyhow::anyhow;
use lazy_static::lazy_static;
use scraper::{ElementRef, Html, Selector};

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

pub fn parse_course_info(html: Html) -> anyhow::Result<Vec<Course>> {
    html.select(&Selector::parse(".catalog-page-detail-table-row").unwrap())
        .skip(1)
        .map(|el| {
            Ok(Course {
                name: select(&el, &NAME_SELECTOR)?,
                teacher: select(&el, &TEACHER_SELECTOR)?,
                semester: select_all(&el, &SEMESTER_SELECTOR)?.join(","),
                period: select(&el, &PERIOD_SELECTOR)?,
                code: select_all(&el, &CODE_SELECTOR)?.join(" "),
            })
        })
        .collect()
}

fn select(el: &ElementRef, selector: &Selector) -> anyhow::Result<String> {
    el.select(selector)
        .next()
        .ok_or(anyhow!(
            "Couldn't find matching element for selector {:?}",
            selector,
        ))
        .map(|val| val.text().next().unwrap().trim().to_owned())
}

fn select_all<'a>(
    html: &'a ElementRef,
    selector: &'static Selector,
    // nth: usize,
) -> anyhow::Result<Vec<&'a str>> {
    html.select(selector)
        .next()
        .ok_or(anyhow!(
            "Couldn't find matching element for selector {:?}",
            selector,
        ))
        .map(|val| {
            val.text()
                .map(|text| text.trim())
                .filter(|&text| !text.is_empty())
                .collect::<Vec<_>>()
        })
}
