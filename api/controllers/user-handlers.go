package controllers

import (
	"encoding/json"
	"fmt"
	"independent-study-api/internal/db"
	"net/http"
)

func VerifyHandler(w http.ResponseWriter, r *http.Request) {
	userData, ok := r.Context().Value("props").(db.MicrosoftUser)
	if !ok {
		// Handle the case where the user data is not found or of the wrong type
		fmt.Println("User data not found in the context")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	} else {
		err := json.NewEncoder(w).Encode(userData)
		if err != nil {
			fmt.Println("error userhandler 22", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	userData, ok := r.Context().Value("props").(db.MicrosoftUser)
	if !ok {
		fmt.Println("User data not found in the context")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	} else {
		currentUser, _ := db.FindUser(userData)
		err := json.NewEncoder(w).Encode(currentUser)
		if err != nil {
			fmt.Println("error userhandler.go 40", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
