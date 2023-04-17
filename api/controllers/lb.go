package controllers

import (
	"encoding/json"
	"fmt"
	"independent-study-api/internal/db"
	"net/http"
)

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	usersByRank := db.GetUsersByRank(false)
	err := json.NewEncoder(w).Encode(usersByRank)
	if err != nil {
		fmt.Println("lb 14 error sending json", err)
		w.WriteHeader(500)
		return
	}
}
