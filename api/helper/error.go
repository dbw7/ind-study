package helper

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
)

// Ellipsis for optional paramater, or multiple of paramater
func CheckErr(err error, message ...string) {
	if err != nil {
		_, filename, line, _ := runtime.Caller(1)
		log.Printf("[error] %s:%d %v", filename, line, err)
		log.Printf("[error-custom-message] %s:%d %v", filename, line, message)
		//ErrLog("[error] %s:%d %v", filename, line, err)
	}
}

func RequestError(lineNumber string, status string, message string, w http.ResponseWriter, req http.Request) {
	fmt.Println(lineNumber, message)
	w.WriteHeader(http.StatusInternalServerError)
	err := json.NewEncoder(w).Encode(map[string]string{"status": status, "message": message})
	if err != nil {
		//Log the error here
		fmt.Println(lineNumber, "Failed to encode json and", message)
	}
}
