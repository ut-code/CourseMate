package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// dist server
// this go file is only intended to serve /dist after building with vite build.

func main() {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("./dist"))
	mux.Handle("/", http.StripPrefix("/", fs))
	server := http.Server{
		// is this what server/.env/WEB_ORIGIN_BUILD mean?
		Addr:    ":4173",
		Handler: mux,
	}

	var errch chan error
	go func() {
		errch <- server.ListenAndServe()
	}()

	interrupt, cancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
	defer cancel()

	select {
	case err := <-errch:
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
