package db

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var GamesCollection *mongo.Collection

type DBGame struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id"`
	P1Email string             `bson:"p1Email"`
	P2Email string             `bson:"p2Email"`

	P1Name string `bson:"p1Name"`
	P2Name string `bson:"p2Name"`

	RoomID string `bson:"roomID"`

	P1Rating int `bson:"p1Rating"`
	P2Rating int `bson:"p2Rating"`

	P1Rank int `bson:"p1Rank"`
	P2Rank int `bson:"p2Rank"`

	Result  string `bson:"result"`
	Winner  string `bson:"winner"`
	Loser   string `bson:"loser"`
	Quitter string `bson:"quitter"`

	P1EloChange int `bson:"p1EloChange"`
	P2EloChange int `bson:"p2EloChange"`
}

func FindGame(gamex DBGame) (DBGame, bool) {
	var result DBGame
	filter := bson.M{"_id": gamex.ID}
	err := GamesCollection.FindOne(Ctx, filter).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			//fmt.Println("We didn't find this homie", err, gamex.ID)
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

func CreateOrUpdateGame(dbgame DBGame) {
	fmt.Println("Creating or updating game")
	_, foundGame := FindGame(dbgame)
	//fmt.Printf("in db game %+v\n", dbgame)
	if !foundGame {
		result, err := GamesCollection.InsertOne(Ctx, dbgame)
		_ = result
		if err != nil {
			fmt.Println("Error inserting game db game 65", err)
			return
		}
	} else {
		filter := bson.M{"_id": dbgame.ID}
		update := bson.M{"$set": bson.M{
			"result":      dbgame.Result,
			"winner":      dbgame.Winner,
			"loser":       dbgame.Loser,
			"quitter":     dbgame.Quitter,
			"p1Rating":    dbgame.P1Rating,
			"p2Rating":    dbgame.P2Rating,
			"p1Rank":      dbgame.P1Rank,
			"p2Rank":      dbgame.P2Rank,
			"p1EloChange": dbgame.P1EloChange,
			"p2EloChange": dbgame.P2EloChange,
		}}
		_, err := GamesCollection.UpdateOne(Ctx, filter, update)
		//fmt.Println("result", result)
		if err != nil {
			fmt.Println("Error updating game 84", err)
		}
	}
}
