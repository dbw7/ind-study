package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"independent-study-api/config"
	"io"
	"net/http"

	"golang.org/x/oauth2"
)

type MicrosoftUser struct {
	ID          string `json:"id"`
	GivenName   string `json:"givenName"`
	Surname     string `json:"surname"`
	Mail        string `json:"mail"`
	DisplayName string `json:"displayName"`
}

func MicrosoftLogin(w http.ResponseWriter, req *http.Request) {
	microsoftConfig := config.SetupConfig()
	url := microsoftConfig.AuthCodeURL("randomstates")
	http.Redirect(w, req, url, http.StatusSeeOther)
}

func MicrosoftCallback(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	state := req.URL.Query()["state"][0]
	if state != "randomstate" {
		fmt.Println("Line 37 ms.go: states dont match")
		w.WriteHeader(http.StatusBadRequest)
		err := json.NewEncoder(w).Encode(map[string]string{"status": "error", "message" : "States do not match"})
		if err != nil {
			//Log the error here
			fmt.Println("ms.go 38: States dont match and failed to encode json")
		}
		return
	}
	
	code := req.URL.Query()["code"][0]
	microsoftConfig := config.SetupConfig()
	token, err := microsoftConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("Code-Token Exchange Failed")
		w.WriteHeader(http.StatusExpectationFailed)
		err := json.NewEncoder(w).Encode(map[string]string{"status": "error", "message" : "Code-Token Exchange Failed"})
		if err != nil {
			//Log the error here
			fmt.Println("ms.go 52: Code-Token Exchange Failed and failed to encode json")
		}
	}

	client := microsoftConfig.Client(context.Background(), token)
	resp, err := client.Get("https://graph.microsoft.com/v1.0/me")
	if err != nil {
		fmt.Println("ms.go 59: Error getting user")
		w.WriteHeader(http.StatusInternalServerError)
		err := json.NewEncoder(w).Encode(map[string]string{"status": "error", "message" : "Error getting user"})
		if err != nil {
			//Log the error here
			fmt.Println("ms.go 52: error getting user and failed to encode json")
		}
	}
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err, w, "Parsing data failed")
	}

	var user MicrosoftUser
	if err := json.Unmarshal(body, &user); err != nil {
		fmt.Println("Can not unmarshal JSON")
		fmt.Println(err)
	}
	fmt.Println(user)
	fmt.Fprintln(w, user)
	//resp, err := http.Get("https://graph.microsoft.com/v1.0/me")
	//resp.Header.Set("Authorization", "Bearer "+token)
	defer resp.Body.Close()
}
