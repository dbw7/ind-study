package main

import (
	"encoding/json"
	"fmt"
	ws2 "independent-study-api/pkg/ws"
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
	//router.Get("/api/getExample", getHandler)
	//router.Get("/api/post", postHandler)

	//router.HandleFunc("/auth", controllers.MicrosoftLogin)
	//router.HandleFunc("/auth/ms", controllers.MicrosoftCallback)
	router.HandleFunc("/ws", serveWs)

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

func getHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("You got me")
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("You just sent me a post req!")
}
