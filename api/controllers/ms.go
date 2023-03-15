package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"independent-study-api/config"
	"independent-study-api/helper"
	"io"
	"net/http"
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
	url := microsoftConfig.AuthCodeURL("randomstate")
	http.Redirect(w, req, url, http.StatusSeeOther)
}

func MicrosoftCallback(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	state := req.URL.Query()["state"][0]
	if state != "randomstate" {
		helper.RequestError("ms.go 41", "error", "states dont match", w, *req)
		return
	}

	code := req.URL.Query()["code"][0]
	microsoftConfig := config.SetupConfig()
	token, err := microsoftConfig.Exchange(context.Background(), code)
	if err != nil {
		helper.RequestError("ms.go 42", "error", "Code-Token Exchange Failed", w, *req)
		fmt.Println("ms go 42 error", err)
		return
	}

	client := microsoftConfig.Client(context.Background(), token)
	resp, err := client.Get("https://graph.microsoft.com/v1.0/me")
	if err != nil {
		helper.RequestError("ms.go 49", "error", "Error getting user", w, *req)
		fmt.Println("ms go 49 error", err)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		helper.RequestError("ms.go 55", "error", "Parsing data failed", w, *req)
		fmt.Println(err, "Parsing data failed")
		fmt.Println("ms go 57 error", err)
		return
	}

	var user MicrosoftUser
	if err := json.Unmarshal(body, &user); err != nil {
		helper.RequestError("ms.go 62", "error", "Can not unmarshal JSON", w, *req)
		fmt.Println("Can not unmarshal JSON", err)
		return
	}
	fmt.Println(user)
	defer resp.Body.Close()
}
