package main

import (
	"encoding/json"
	"log"
	"os"
)

var urls = map[string]string{
	"law":          "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=1&page=",
	"medicine":     "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=2&page=",
	"engineering":  "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=3&page=",
	"arts":         "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=4&page=",
	"science":      "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=5&page=",
	"agriculture":  "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=6&page=",
	"economics":    "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=7&page=",
	"liberal_arts": "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=8&page=",
	"education":    "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=9&page=",
	"pharmacy":     "https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=10&page=",
}

func main() {

	data := scrapeAll(urls)

	f, err := os.Create("./kouki.json")
	if err != nil {
		log.Fatalln("Failed to create kouki.json for error: ", err)
	}
	defer f.Close()

	err = json.NewEncoder(f).Encode(data)
	if err != nil {
		log.Fatalln("Failed to encode json for error: ", err)
	}
}
