package controllers

import (
	"encoding/json"
	"fmt"
	"independent-study-api/internal/db"
	"net/http"
	"os"
	"strings"
)

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	userData, ok := r.Context().Value("props").(db.MicrosoftUser)
	if ok {
		if !strings.Contains(userData.Email, os.Getenv("EMAIL_SUB")) {
			w.WriteHeader(403)
			return
		}
	}

	usersByRank := db.GetUsersByRank(false)
	err := json.NewEncoder(w).Encode(usersByRank)
	if err != nil {
		fmt.Println("lb 14 error sending json", err)
		w.WriteHeader(500)
		return
	}
}
