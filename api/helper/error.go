package helper

import (
	"log"
	"runtime"
)

//Ellipsis for optional paramater, or multiple of paramater
func CheckErr(err error, message ...string) {
	if err != nil {
		_, filename, line, _ := runtime.Caller(1)
		log.Printf("[error] %s:%d %v", filename, line, err)
		log.Printf("[error-custom-message] %s:%d %v", filename, line, message)
		//ErrLog("[error] %s:%d %v", filename, line, err)
	}
}
