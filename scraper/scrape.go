package main

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"strconv"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly"

	"github.com/ut-code/CourseMate/scraper/logging"
)

const DETAIL_PAGE_BASE_URL = "https://catalog.he.u-tokyo.ac.jp/"

type Course struct {
	Name     string `json:"name"`
	Teacher  string `json:"teacher"`
	Semester string `json:"semester"`
	Period   string `json:"period"`
	Code     string `json:"code"`
}

type Entry struct {
	Faculty string   `json:"faculty"`
	Courses []Course `json:"courses"`
}
type Result []Entry

var logger logging.Logger

func init() {
	logger = logging.New()
}

// urls: [faculty name] => search url template
func scrapeAll(urls map[string]string) Result {
	logger.Notify("Starting...")

	var result Result

	var total = len(urls)
	var curr = 0

	for faculty, url := range urls {
		logger.Notify(fmt.Sprint("-----------------------------Starting faculty-----------------------------", faculty, ":", curr, "out of", total))
		// intentionally not multi threading
		lectures := scrape(url)
		result = append(result, Entry{
			Faculty: faculty,
			Courses: lectures,
		})
		logger.Notify(fmt.Sprint("-----------------------------Done faculty-----------------------------", faculty, ":", curr, "out of", total))
	}

	return result
}

func scrape(url_template string) (courses []Course) {
	collector := colly.NewCollector(
		colly.CacheDir("./.colly.cache"),
	)

	var mtx sync.Mutex
	collector.OnResponse(func(e *colly.Response) {
		logger.Step("Done visiting url " + e.Request.URL.String())
		c := fetchAttrs(e)
		mtx.Lock()
		courses = append(courses, c)
		mtx.Unlock()
	})

	var pagerWG sync.WaitGroup
	pager := colly.NewCollector(
		colly.CacheDir("./.colly.cache"),
	)
	pager.OnHTML("a.catalog-search-result-card-header-detail-link", func(e *colly.HTMLElement) {
		href := e.Attr("href")
		if href == "" {
			log.Fatalln("Failed to get href of elem in " + e.Request.URL.String())
		}
		url := DETAIL_PAGE_BASE_URL + href

		logger.Notify("Visiting " + url)

		pagerWG.Add(1)
		go func() {
			defer pagerWG.Done()
			err := collector.Visit(url)
			if err != nil && !errors.Is(err, colly.ErrAlreadyVisited) {
				log.Fatalln("error while visiting collector: ", err)
			}
		}()
	})

	for i := 0; true; i += 1 {
		url := url_template + strconv.Itoa(i)
		err := pager.Visit(url)
		if err != nil {
			if errors.Is(err, colly.ErrMissingURL) {
				break
			} else {
				log.Fatalln("error visiting pager: ", url)
			}
		}
	}

	pagerWG.Wait()
	return courses
}

func fetchAttrs(res *colly.Response) Course {
	doc, err := goquery.NewDocumentFromReader(bytes.NewBuffer(res.Body))
	assertNil(err, "Parsing Document")

	return Course{
		Code:     assert(selectNth(doc, ".catalog-page-detail-table-cell.code-cell", 1)),
		Name:     assert(selectNth(doc, ".catalog-page-detail-table-cell.name-cell", 1)),
		Teacher:  assert(selectNth(doc, ".catalog-page-detail-table-cell.lecturer-cell", 1)),
		Period:   assert(selectNth(doc, ".catalog-page-detail-table-cell.period-cell", 1)),
		Semester: assert(selectNth(doc, ".catalog-page-detail-table-cell.semester-cell", 1)),
	}
}

// index is 0-based. index = 0 if you want the first element, and index = 1 if you want the second.
func selectNth(doc *goquery.Document, selector string, index int) (string, error) {
	node := doc.Find(selector).Get(index)
	if node == nil {
		return "", errors.New(
			"Not enough selections: expected " + strconv.Itoa(index) +
				", but got " + strconv.Itoa(doc.Find(selector).Length()))
	}
	return node.Data, nil
}

func assert[T any](t T, err error) T {
	if err != nil {
		log.Fatalln("Assertion failed with error", err)
	}
	return t
}
func orEmpty(t string, err error) string {
	if err != nil {
		return ""
	}
	return t
}
