package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"independent-study-api/controllers"
	ws2 "independent-study-api/internal/ws"
	"log"
	"net/http"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println(err)
		log.Fatalf("Error loading .env file")
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {

	ws, err := ws2.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	go ws2.Writer(ws)
	ws2.Reader(ws)
}

func main() {
	fmt.Println("Starting server...")

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	//router.Get("/api/getExample", getHandler)
	//router.Get("/api/test", middleware.AuthMiddleware(http.HandlerFunc(getHandler)))
	router.Get("/api/test", testHandler)
	router.HandleFunc("/auth", controllers.MicrosoftLogin)
	router.HandleFunc("/auth/ms", controllers.MicrosoftCallback)
	//router.HandleFunc("/ws", serveWs)

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

func testHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("You just sent me a post req!")
}
