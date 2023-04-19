package controllers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"independent-study-api/helper"
	"independent-study-api/internal/config"
	"independent-study-api/internal/db"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

type JsonResponse struct {
	//Action         string   `json:"action"`
	Message     string `json:"message"`
	MessageType string `json:"message_type"`
}

func generateStateOauthCookie(w http.ResponseWriter) string {
	var expiration = time.Now().Add(365 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
	http.SetCookie(w, &cookie)

	return state
}

func MicrosoftLogin(w http.ResponseWriter, req *http.Request) {
	microsoftConfig := config.SetupConfig()
	oauthState := generateStateOauthCookie(w)
	url := microsoftConfig.AuthCodeURL(oauthState)
	http.Redirect(w, req, url, http.StatusSeeOther)
}

func MicrosoftCallback(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	//state := req.URL.Query()["state"][0]
	//
	//if state != "randomstate" {
	oauthState, _ := req.Cookie("oauthstate")
	if req.FormValue("state") != oauthState.Value {
		fmt.Println("ms.go 31 error states dont match")
		redirect := os.Getenv("CLIENT_URL") + "/login?failed=states-dont-match"
		http.Redirect(w, req, redirect, 302)
		//response := JsonResponse{"States do not match", "Error"}
		//w.WriteHeader(400)
		//err := json.NewEncoder(w).Encode(response)
		//if err != nil {
		//	fmt.Println("ms.go 36 error encoding json", err)
		//}
		return
	}

	code := req.URL.Query()["code"][0]
	microsoftConfig := config.SetupConfig()
	token, err := microsoftConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("ms.go 47 Code-Token Exchange Failed", err)
		redirect := os.Getenv("CLIENT_URL") + "/login?failed=code-token-exchange-failed"
		http.Redirect(w, req, redirect, 302)
		//response := JsonResponse{"Code-Token Exchange Failed", "Error"}
		//w.WriteHeader(500)
		//err := json.NewEncoder(w).Encode(response)
		//if err != nil {
		//	fmt.Println("ms.go 50 error encoding json", err)
		//}
		return
	}

	client := microsoftConfig.Client(context.Background(), token)
	resp, err := client.Get("https://graph.microsoft.com/v1.0/me")
	if err != nil {
		fmt.Println("ms.go 59 Error getting user", err)
		redirect := os.Getenv("CLIENT_URL") + "/login?failed=error-getting-user-from-microsoft"
		http.Redirect(w, req, redirect, 302)
		//response := JsonResponse{"Error getting user", "Error"}
		//w.WriteHeader(500)
		//err := json.NewEncoder(w).Encode(response)
		//if err != nil {
		//	fmt.Println("ms.go 64 error encoding json", err)
		//}
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("ms.go 71 Parsing data failed", err)
		redirect := os.Getenv("CLIENT_URL") + "/login?failed=error-parsing-body-data"
		http.Redirect(w, req, redirect, 302)
		//response := JsonResponse{"Parsing data failed", "Error"}
		//w.WriteHeader(500)
		//err := json.NewEncoder(w).Encode(response)
		//if err != nil {
		//	fmt.Println("ms.go 75 error encoding json", err)
		//}
		return
	}

	var user db.MicrosoftUser
	if err := json.Unmarshal(body, &user); err != nil {
		fmt.Println("ms.go 84 Can not unmarshal JSON", err)
		redirect := os.Getenv("CLIENT_URL") + "/login?message=cant-unmarshal-microsoft-data"
		http.Redirect(w, req, redirect, 302)
		//response := JsonResponse{"Error unmarshalling Microsoft response", "Error"}
		//w.WriteHeader(500)
		//err := json.NewEncoder(w).Encode(response)
		//if err != nil {
		//	fmt.Println("ms.go 87 error encoding json", err)
		//}
		return
	}
	//fmt.Println(user)
	foundUser, existsInDbAlready := db.FindUser(user)
	if !existsInDbAlready {
		user.ID = primitive.NewObjectID()
		user.Rating = 1200
		user.Wins = 0
		user.Losses = 0
		user.Draws = 0
		user.Rank = 999
	} else {
		user = foundUser
	}
	userWasCreated := db.FindOrCreateUser(user)
	_ = userWasCreated
	tokenString, worked := helper.CreateToken("", user)
	if worked {
		_, tokenValidlyParsed := helper.ParseToken(tokenString)
		if tokenValidlyParsed {
			//This means the token was validly created and validly parsed for verification
			redirect := os.Getenv("CLIENT_URL") + "/login?token=" + tokenString + "&firstTime=" + strconv.FormatBool(!existsInDbAlready)
			http.Redirect(w, req, redirect, 302)
			return
		} else {
			//This means there was an error parsing the token/verifying it
			redirect := os.Getenv("CLIENT_URL") + "/login?failed=error-parsing-or-verifying-token"
			http.Redirect(w, req, redirect, 302)
			return
		}
	} else {
		//This means there was an error creating the token
		redirect := os.Getenv("CLIENT_URL") + "/login?failed=error-creating-token"
		http.Redirect(w, req, redirect, 302)
		return
	}

}
