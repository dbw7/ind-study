package ws

import (
	"fmt"
	"github.com/gorilla/websocket"
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
				fmt.Println("game", game)
				fmt.Printf("%+v\n", game)
				if *conn == game.P1Conn && !game.Started {
					fmt.Println("it is player 1's connection")
					mu.Lock()
					safelyCloseConnections(game.P1Conn, game.P2Conn, "conn 26")
					delete(connections, game.RoomID)
					game.GameInstance = *EmptyGameInstance
					game = EmptyGame
					mu.Unlock()
				} else if *conn == game.P1Conn && game.Started {
					//This means player 1 quit/disconnected
					mu.Lock()
					game.EmailOfOneWhoMadeLastMoveAKAWinner = game.P2Email
					game.SomeoneWon = true
					game.P2Conn.WriteJSON(game)
					safelyCloseConnections(game.P1Conn, game.P2Conn, "conn 35")
					delete(connections, game.RoomID)
					game.GameInstance = *EmptyGameInstance
					game = EmptyGame
					mu.Unlock()
				} else if *conn == game.P2Conn && game.Started {
					//This means player 2 quit/disconnected.
					mu.Lock()
					game.EmailOfOneWhoMadeLastMoveAKAWinner = game.P1Email
					game.SomeoneWon = true
					game.P1Conn.WriteJSON(game)
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
			fmt.Println("Payload", payload)
			//sends this to the websocket channel
			wsChan <- payload
			game.MsgChan <- "Good"
		}
	}
}
