package main

import (
	"encoding/json"
	"fmt"
	"independent-study-api/controllers"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println(err)
		log.Fatalf("Error loading .env file")
	}
}

func main() {
	fmt.Println("Starting server...")

	router := chi.NewRouter()
	router.Get("/api/getExample", getHandler)
	router.Get("/api/post", postHandler)

	router.HandleFunc("/auth/ms", controllers.MicrosoftLogin)
	router.HandleFunc("/auth/ms/callback", controllers.MicrosoftCallback)

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

func getHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("You got me")
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("You just sent me a post req!")
}
