package db

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"sort"
)

type MicrosoftUser struct {
	//ID string `json:"ID" bson:"_id,omitempty"`
	ID        primitive.ObjectID `json:"_id" bson:"_id"`
	MSID      string             `json:"Id" bson:"Id"`
	GivenName string             `json:"givenName" bson:"givenName"`
	Surname   string             `json:"surname" bson:"surname"`
	// Mail        string `json:"mail"`
	Email       string `json:"userPrincipalName" bson:"email"`
	DisplayName string `json:"displayName" bson:"displayName"`
	Rating      int    `json:"rating" bson:"rating"`
	Wins        int    `json:"wins" bson:"wins"`
	Losses      int    `json:"losses" bson:"losses"`
	Draws       int    `json:"draws" bson:"draws"`
	Rank        int    `json:"rank" bson:"rank"`
}

var (
	UserCollection *mongo.Collection
)

// Searches for user in the database using the info from MS
// Returns the user and a bool on whether the user was found in the db

func FindUser(user MicrosoftUser) (MicrosoftUser, bool) {
	var result MicrosoftUser
	filter := bson.M{"Id": user.MSID}
	err := UserCollection.FindOne(Ctx, filter).Decode(&result)

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

func GetUsersNameRankAndRating(userEmail string) (string, int, int) {
	var user MicrosoftUser
	err := UserCollection.FindOne(Ctx, bson.M{"email": userEmail}).Decode(&user)
	//fmt.Println("User", user, userEmail)
	if err != nil {
		fmt.Println("Error getting user name", err)
		return "", 0, 0
	} else {
		return user.DisplayName, user.Rank, user.Rating
	}
}

func GetUsersByRank(wantExtraInfo bool) []MicrosoftUser {
	opts := options.Find().SetSort(bson.D{{Key: "rank", Value: 1}})
	filter := bson.M{"email": bson.M{"$regex": "@villanova\\.edu", "$options": "i"}}
	cursor, err := UserCollection.Find(Ctx, filter, opts)
	if err != nil {
		fmt.Println("Error getting users by rank1", err)
		return nil
	}
	defer cursor.Close(Ctx)

	var users []MicrosoftUser
	err = cursor.All(Ctx, &users)
	if err != nil {
		fmt.Println("Error getting users by rank2", err)
		return nil
	}
	if !wantExtraInfo {
		for i := range users {
			users[i].Email = ""
			users[i].ID = primitive.NilObjectID
			users[i].MSID = ""
		}
	}

	return users
}

func GetUsers() []MicrosoftUser {
	cursor, err := UserCollection.Find(Ctx, bson.M{})
	if err != nil {
		fmt.Println("Error getting users by rank1", err)
		return nil
	}
	defer cursor.Close(Ctx)

	var users []MicrosoftUser
	err = cursor.All(Ctx, &users)
	if err != nil {
		fmt.Println("Error getting users by rank2", err)
		return nil
	}
	return users
}

func UpdateUsersRanks() {
	AllUsers := GetUsers()
	if len(AllUsers) == 0 {
		return
	}
	sort.Slice(AllUsers[:], func(i, j int) bool {
		return AllUsers[i].Rating > AllUsers[j].Rating
	})

	for idx, user := range AllUsers {
		//fmt.Println("user", user, idx)
		filter := bson.M{"_id": user.ID}
		update := bson.M{"$set": bson.M{"rank": idx + 1}}
		_, err := UserCollection.UpdateOne(Ctx, filter, update)
		//fmt.Println("result", result)
		if err != nil {
			fmt.Println("Error updating user rank 146", err)
		}
	}
}
