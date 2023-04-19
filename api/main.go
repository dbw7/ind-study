package main

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"independent-study-api/controllers"
	"independent-study-api/internal/ws"
	"independent-study-api/middleware"
	"log"
	"net/http"
	"os"
)

func main() {
	fmt.Println("Starting server...")

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{os.Getenv("CLIENT_URL")},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Get("/api/test", testHandler)
	router.Get("/api/leaderboard", middleware.AuthMiddleware(http.HandlerFunc(controllers.LeaderboardHandler)))
	router.Get("/api/userdata", middleware.AuthMiddleware(http.HandlerFunc(controllers.UserHandler)))

	router.HandleFunc("/auth", controllers.MicrosoftLogin)
	router.HandleFunc("/auth/ms", controllers.MicrosoftCallback)
	router.Get("/auth/verify", middleware.AuthMiddleware(http.HandlerFunc(controllers.VerifyHandler)))

	router.HandleFunc("/ws:{room}:{player}:{token}", ws.ServeWs)
	go ws.ListenToWsChannel()

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

func testHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
