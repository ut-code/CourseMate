package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
)

// dist server
// this go file is only intended to serve /dist after building with vite build.

const PORT uint16 = 4173
const SERVE_DIR string = "../dist"

func main() {
	server := http.Server{
		Addr:    ":" + fmt.Sprint(PORT),
		Handler: http.FileServer(http.Dir(SERVE_DIR)),
	}

	log.Println("[web] Serving static directory...")
	if err := server.ListenAndServe(); errors.Is(err, http.ErrServerClosed) {
		log.Fatalln(err)
	}
}
