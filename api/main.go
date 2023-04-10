package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"independent-study-api/controllers"
	"independent-study-api/helper"
	"independent-study-api/internal/ws"
	"log"
	"net/http"
	"strings"
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
	router.Get("/auth/verify", verifyHandler)
	router.HandleFunc("/ws:{room}:{player}", ws.ServeWs)

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

func testHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
func verifyHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
	if len(authHeader) != 2 {
		w.WriteHeader(http.StatusUnauthorized)
	} else {
		userJSON, worked := helper.ParseToken(authHeader[1])
		if worked {
			err := json.NewEncoder(w).Encode(userJSON)
			if err != nil {
				fmt.Println("error main.go", err)
				w.WriteHeader(http.StatusInternalServerError)
			} else {
				w.WriteHeader(http.StatusOK)
			}
		} else {
			w.WriteHeader(http.StatusUnauthorized)
		}
	}
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(chi.URLParam(r, "room"))
}
