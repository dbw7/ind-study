package config

import (
	"os"

	"golang.org/x/oauth2"
)

func SetupConfig() *oauth2.Config {
	conf := &oauth2.Config{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		RedirectURL:  os.Getenv("SERVER_URL") + "/auth/ms",
		Scopes: []string{
			"https://graph.microsoft.com/User.Read",
		},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
			TokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
		},
	}
	return conf
}
