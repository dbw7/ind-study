package db

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type MicrosoftUser struct {
	ID string `json:"ID" bson:"_id,omitempty"`
	//MSID      string             `json:"MSID" bson:"msid"`
	GivenName string `json:"givenName" bson:"givenName"`
	Surname   string `json:"surname" bson:"surname"`
	// Mail        string `json:"mail"`
	Email       string `json:"userPrincipalName" bson:"email"`
	DisplayName string `json:"displayName" bson:"displayName"`
}

var (
	UserCollection *mongo.Collection
	Ctx            = context.TODO()
)

func init() {
	serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().
		ApplyURI("mongodb://localhost:27017").
		SetServerAPIOptions(serverAPIOptions)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Successfully connected!")
	}
	UserCollection = client.Database("wschess").Collection("users")
}

// Searches for user in the database using the info from MS
// Returns the user and a bool on whether the user was found in the db

func FindUser(user MicrosoftUser) (MicrosoftUser, bool) {
	var result MicrosoftUser
	err := UserCollection.FindOne(Ctx, user).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			//fmt.Println("We didn't find this homie")
			return result, false
		} else {
			fmt.Println("Unknown error trying to find user 54", err)
			return result, false
		}
	} else {
		//This means we did find the user
		//fmt.Println("result", result)
		return result, true
	}
}

//First checks if user is in database, if user is not in database, we add them to the database, returns a bool
//On whether the user was successfully found/added to the database or not

func FindOrCreateUser(user MicrosoftUser) bool {
	_, foundUser := FindUser(user)

	if !foundUser {
		result, err := UserCollection.InsertOne(Ctx, user)
		_ = result
		if err != nil {
			//fmt.Println("Error inserting user db user 46", err)
			return false
		} else {
			//fmt.Println("result", result)
			return true
		}
	} else {
		return true
	}

}
