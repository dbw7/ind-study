package helper

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"independent-study-api/internal/db"
	"os"
	"time"
)

type JWTClaims struct {
	MSUser db.MicrosoftUser
	*jwt.RegisteredClaims
}

var jwtKey = []byte(os.Getenv("JWT"))

func CreateToken(sub string, userInfo db.MicrosoftUser) (string, bool) {
	// Get the token instance with the Signing method
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	// Choose an expiration time. Shorter the better
	exp := time.Now().Add(time.Hour * 24 * 3)
	//exp := time.Now().Add(time.Second * 1)
	// Add your claims
	token.Claims = &JWTClaims{
		userInfo,
		&jwt.RegisteredClaims{
			// Set the exp and sub claims. sub is usually the userID
			ExpiresAt: jwt.NewNumericDate(exp),
			//Subject:   sub,
		},
	}
	// Sign the token with your secret key
	val, err := token.SignedString(jwtKey)

	if err != nil {
		// On error return the error
		fmt.Println("Error signing token jwt 36", err)
		return "", false
	}
	// On success return the token string
	return val, true
}

func ParseToken(tokenString string) (user db.MicrosoftUser, worked bool) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	//This means something went wrong parsing key
	if err != nil {
		fmt.Println(user)
		fmt.Println("jwt 49 you bozo, error parsing key, probably something malicious:", err)
		return user, false
	}
	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		//fmt.Println("49 claims", claims)
		//fmt.Printf("50 %v %v", claims.MSUser, claims.RegisteredClaims.Issuer)
		//fmt.Println("jwt 54", claims.MSUser)
		return claims.MSUser, true
	} else {
		fmt.Println("error jwt 52", err)
		return user, false
	}
}
