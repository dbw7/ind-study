package ws

import (
	"fmt"
	"independent-study-api/helper"
	"independent-study-api/internal/db"
	"log"
)

func ListenToWsChannel() {
	var response wsJsonResponse
	for {
		event := <-wsChan
		response = wsJsonResponse(event)
		room := event.RoomID
		fmt.Println("room", room)
		if connections[room] == nil {
			fmt.Println("Connection closed unexpectedly", event)
			return
		}
		mu.Lock()
		//fmt.Println("event data", event)
		//fmt.Println("response data", response)
		conn1 := connections[room].P1Conn
		conn2 := connections[room].P2Conn
		response.Fen = event.Fen
		response.Started = true
		response.RoomID = event.RoomID
		response.GetsFirstTurn = connections[room].GetsFirstTurn
		response.EmailOfOneWhoMadeLastMoveAKAWinner = event.EmailOfOneWhoMadeLastMoveAKAWinner
		response.IsDraw = event.IsDraw

		if event.EmailOfOneWhoMadeLastMoveAKAWinner == connections[room].P1Email {
			response.CurrentTurn = connections[room].P2Email
		} else {
			response.CurrentTurn = connections[room].P1Email
		}
		connections[room].CurrentTurn = response.CurrentTurn
		connections[room].EmailOfOneWhoMadeLastMoveAKAWinner = response.EmailOfOneWhoMadeLastMoveAKAWinner

		if event.SomeoneWon {
			var p1IsWinner bool
			if event.P1Email == event.EmailOfOneWhoMadeLastMoveAKAWinner {
				p1IsWinner = true
			} else {
				p1IsWinner = false
			}
			var rating1Int, rating2Int, elo1Change, elo2Change int
			if p1IsWinner {
				connections[room].GameInstance.Winner = connections[room].P1Name
				connections[room].GameInstance.Loser = connections[room].P2Name
				rating1Int, rating2Int, elo1Change, elo2Change = helper.UpdateElo(connections[room].P1Rating, connections[room].P2Rating, 1)
			} else {
				rating1Int, rating2Int, elo1Change, elo2Change = helper.UpdateElo(connections[room].P1Rating, connections[room].P2Rating, 0)
				connections[room].GameInstance.Winner = connections[room].P2Name
				connections[room].GameInstance.Loser = connections[room].P1Name
			}

			response.P1Rating = rating1Int
			response.P2Rating = rating2Int
			response.P1EloChange = elo1Change
			response.P2EloChange = elo2Change
			connections[room].GameInstance.P1Rating = rating1Int
			connections[room].GameInstance.P2Rating = rating2Int
			connections[room].GameInstance.P1EloChange = elo1Change
			connections[room].GameInstance.P2EloChange = elo2Change
			//fmt.Printf("%+v\n", connections[room].GameInstance)
			db.CreateOrUpdateGame(connections[room].GameInstance)
			err := conn1.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}
			err = conn2.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}

			safelyCloseConnections(connections[room].P1Conn, connections[room].P2Conn, "channel 47")
			connections[room].GameInstance = *EmptyGameInstance
			connections[room] = EmptyGame
			delete(connections, room)
		} else if event.IsDraw {
			err := conn1.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}
			err = conn2.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}
			safelyCloseConnections(connections[room].P1Conn, connections[room].P2Conn, "channel 50")
			connections[room].GameInstance = *EmptyGameInstance
			connections[room] = EmptyGame
			delete(connections, room)
		} else {
			err := conn1.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}
			err = conn2.WriteJSON(response)
			if err != nil {
				log.Println("Websocket err")
			}
		}
		mu.Unlock()
	}
}
