package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool { return true },
}

func reader(conn *websocket.Conn) {
	for {
		// read in a message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		fmt.Println(string(p))
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}

	}
}
func serveWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)
	// upgrade this connection to a WebSocket
	// connection
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	reader(ws)
}

func main() {
	fmt.Println("Starting server...")

	router := chi.NewRouter()
	router.Get("/api/getExample", getHandler)
	router.Get("/api/post", postHandler)

	router.HandleFunc("/auth", controllers.MicrosoftLogin)
	router.HandleFunc("/auth/ms", controllers.MicrosoftCallback)
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
