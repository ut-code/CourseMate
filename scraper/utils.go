package main

import "log"

func assertNil(err error, ctx string) {
	if err != nil {
		log.Fatalln("Error", ctx, ":", err)
	}
}
