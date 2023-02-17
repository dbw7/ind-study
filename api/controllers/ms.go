package controllers

import (
	"context"
	"fmt"
	"independent-study-api/config"
	"net/http"
)

func MicrosoftLogin(res http.ResponseWriter, req *http.Request) {
	print := fmt.Println
	
	microsoftConfig := config.SetupConfig()
	url := microsoftConfig.AuthCodeURL("randomstate")
	
	print(url)
	
	http.Redirect(res, req, url, http.StatusSeeOther)
}

func MicrosoftCallback(res http.ResponseWriter, req *http.Request) {
	state := req.URL.Query()["state"][0] 
	if(state != "randomstate"){
		fmt.Println(res, "states dont match")
		return	
	}
	
	code := req.URL.Query()["code"][0]
	
	microsoftConfig := config.SetupConfig()
	
	token, err := microsoftConfig.Exchange(context.Background(), code)
	if(err != nil){
		fmt.Println(res, "Code-Token Exchange Failed")
	}
	fmt.Println(token)
	resp, err := http.Get("https://graph.microsoft.com/v1.0/me")
	fmt.Println(resp)
	//resp.Header.Set("Authorization", "Bearer "+token)
}
