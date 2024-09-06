package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
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

	var errch chan error
	go func() {
		log.Println("[web] Serving static directory...")
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
