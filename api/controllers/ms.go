package controllers

import (
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
	
}
