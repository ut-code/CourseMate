package logging

import (
	"log"
	"time"
)

var start = time.Now().UnixMilli()

const APPROX_TOTAL = 100 // FIXME: update this after url list change

type Logger struct {
	count  int
	steps  chan string
	notify chan string
}

func New() Logger {
	l := Logger{
		steps: make(chan string, 10),
	}
	go l.listen()
	return l
}

func (l *Logger) Close() {
	close(l.steps)
	close(l.notify)
}

func (l *Logger) Step(message string) {
	l.steps <- message
}
func (l *Logger) Notify(message string) {
	l.notify <- message
}

func (l *Logger) listen() {
	for {
		select {
		case m := <-l.steps:
			log.Println("[log]", l.count, "(curr) /", APPROX_TOTAL, "(approx total)", m, "--", time.Now().UnixMilli()-start, "ms elapsed")
			l.count += 1
		case m := <-l.notify:
			log.Println("[log]", m, "--", time.Now().UnixMilli()-start, "ms elapsed")
		}
	}
}
