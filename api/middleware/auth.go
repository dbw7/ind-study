package middleware

import (
	"context"
	"fmt"
	"independent-study-api/helper"
	"net/http"
	"strings"
)

func AuthMiddleware(next http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			fmt.Println("Malformed token, request header")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Malformed Token"))
		} else {
			user, worked := helper.ParseToken(authHeader[1])
			if worked {
				ctx := context.WithValue(r.Context(), "props", user)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				fmt.Println("Malformed token, request header")
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Malformed Token"))
			}
		}
	})
}
