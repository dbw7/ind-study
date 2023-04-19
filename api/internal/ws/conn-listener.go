package ws

import (
	"fmt"
	"github.com/gorilla/websocket"
	"independent-study-api/helper"
	"independent-study-api/internal/db"
	"log"
)

func ListenForWs(conn *WebSocketConnection, game *Game) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Error", fmt.Sprintf("%v", r))
		}
	}()
	var payload wsPayload
	for {
		err := conn.ReadJSON(&payload)
		if err != nil {
			//do nothing, there is no payload
			if websocket.IsCloseError(err, websocket.CloseNoStatusReceived, websocket.CloseGoingAway) {
				//fmt.Println("game", game)
				//fmt.Printf("%+v\n", game)
				if *conn == game.P1Conn && !game.Started {
					fmt.Println("it is player 1's connection")
					mu.Lock()

					game.CancelContext()

					safelyCloseConnections(game.P1Conn, game.P2Conn, "conn 26")
					delete(connections, game.RoomID)
					game.GameInstance = *EmptyGameInstance
					game = EmptyGame
					mu.Unlock()
				} else if *conn == game.P1Conn && game.Started {
					//This means player 1 quit/disconnected
					mu.Lock()
					rating1Int, rating2Int, elo1Change, elo2Change := helper.UpdateElo(game.P1Rating, game.P2Rating, 0)
					game.GameInstance.Winner = game.P2Name
					game.GameInstance.Loser = game.P1Name
					game.GameInstance.NewP1Rating = rating1Int
					game.GameInstance.NewP2Rating = rating2Int
					game.GameInstance.P1EloChange = elo1Change
					game.GameInstance.P2EloChange = elo2Change
					game.GameInstance.Result = game.P1Email + " disconnected. " + game.P2Email + " wins by default."
					game.NewP1Rating = rating1Int
					game.NewP2Rating = rating2Int
					game.P1EloChange = elo1Change
					game.P2EloChange = elo2Change
					game.SomeoneQuit = true
					game.GameInstance.Quitter = game.P1Email
					db.CreateOrUpdateGame(game.GameInstance, true, false, false)

					game.EmailOfOneWhoMadeLastMoveAKAWinner = game.P2Email
					game.SomeoneWon = true
					game.P2Conn.WriteJSON(game)

					game.CancelContext()

					safelyCloseConnections(game.P1Conn, game.P2Conn, "conn 35")
					delete(connections, game.RoomID)
					game.GameInstance = *EmptyGameInstance
					game = EmptyGame
					mu.Unlock()
				} else if *conn == game.P2Conn && game.Started {
					//This means player 2 quit/disconnected.
					mu.Lock()
					rating1Int, rating2Int, elo1Change, elo2Change := helper.UpdateElo(game.P1Rating, game.P2Rating, 1)
					game.GameInstance.Winner = game.P1Name
					game.GameInstance.Loser = game.P2Name
					game.GameInstance.NewP1Rating = rating1Int
					game.GameInstance.NewP2Rating = rating2Int
					game.GameInstance.P1EloChange = elo1Change
					game.GameInstance.P2EloChange = elo2Change
					game.GameInstance.Result = game.P2Email + " disconnected. " + game.P1Email + " wins by default."
					game.NewP1Rating = rating1Int
					game.NewP2Rating = rating2Int
					game.P1EloChange = elo1Change
					game.P2EloChange = elo2Change
					game.SomeoneQuit = true
					game.GameInstance.Quitter = game.P2Email
					db.CreateOrUpdateGame(game.GameInstance, true, true, false)

					game.EmailOfOneWhoMadeLastMoveAKAWinner = game.P1Email
					game.SomeoneWon = true
					game.P1Conn.WriteJSON(game)

					game.CancelContext()

					safelyCloseConnections(game.P1Conn, game.P2Conn, "conn 44")
					delete(connections, game.RoomID)
					game.GameInstance = *EmptyGameInstance
					game = EmptyGame
					mu.Unlock()
				}
			}
			fmt.Println("error", err)
			break
		} else {
			//fmt.Println("Payload", payload)
			//sends this to the websocket channel
			wsChan <- payload
			game.MsgChan <- "Good"
		}
	}
}
