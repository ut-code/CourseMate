package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

// dist server
// this go file is only intended to serve /dist after building with vite build.

const serveDir = "./dist"
const addr uint16 = 4173 // is this what server/.env:WEB_ORIGIN_BUILD meant to be?
const restartOnError = false

func main() {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir(serveDir))
	mux.Handle("/", http.StripPrefix("/", fs))
	server := http.Server{
		Addr:    ":" + strconv.Itoa(int(addr)),
		Handler: mux,
	}

	var srvTerm chan error
	go func() {
		var err error
	restart:
		err = server.ListenAndServe()
		if restartOnError {
			fmt.Println("Server failed with error:", err.Error())
			fmt.Println("Restarting...")
			goto restart
		} else {
			srvTerm <- err
		}
	}()

	interrupt, cancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
	defer cancel()

	select {
	case err := <-srvTerm:
		if !errors.Is(err, http.ErrServerClosed) {
			// server failed
			log.Fatalln(err)
		}

	case <-interrupt.Done():
		// interrupted or kill'd with SIGTERM
		// shutting down the server with timeout of 10 sec
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		err := server.Shutdown(ctx)
		if err != nil {
			log.Fatalln(err)
		}
	}
}
