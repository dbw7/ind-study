package ws

import (
	"context"
	"fmt"
	"time"
)

func handleContext(ctx context.Context, conn WebSocketConnection, game *Game) {
	//This is to timeout the game after both players have connected
	timeoutTimer := time.NewTimer(200 * time.Second)

	for {
		select {
		case <-ctx.Done():
			// If the context is canceled, end the loop
			fmt.Println("Connection closed by context")
			mu.Lock()
			safelyCloseConnections(game.P1Conn, game.P2Conn, "handleContext 18")
			delete(connections, game.RoomID)
			game.GameInstance = *EmptyGameInstance
			game = EmptyGame
			mu.Unlock()
			return
		case <-timeoutTimer.C:
			mu.Lock()
			if !game.Started {
				//game.P1Conn.WriteMessage(websocket.TextMessage, []byte("Second player hasn't joined"))
				game.P1Conn.WriteJSON(map[string]interface{}{
					"noJoin": true,
				})
				safelyCloseConnections(game.P1Conn, game.P2Conn, "handleContext 29")
				delete(connections, game.RoomID)
				game.GameInstance = *EmptyGameInstance
				game = EmptyGame
			} else {
				whoHasCurrentTurn := game.CurrentTurn
				game.P1Conn.WriteJSON(map[string]interface{}{
					"tookTooLong": whoHasCurrentTurn,
					"P1Name":      game.P1Name,
					"P2Name":      game.P2Name,
					"P1Email":     game.P1Email,
					"P2Email":     game.P2Email,
				})
				game.P2Conn.WriteJSON(map[string]interface{}{
					"tookTooLong": whoHasCurrentTurn,
					"P1Name":      game.P1Name,
					"P2Name":      game.P2Name,
					"P1Email":     game.P1Email,
					"P2Email":     game.P2Email,
				})
				game.GameInstance.Result = whoHasCurrentTurn + "Took too long"
				if whoHasCurrentTurn == game.P1Email {
					game.GameInstance.Winner = game.P2Email
				} else {
					game.GameInstance.Winner = game.P1Email
				}
				safelyCloseConnections(game.P1Conn, game.P2Conn, "handleContext 47")
				delete(connections, game.RoomID)
				game.GameInstance = *EmptyGameInstance
				game = EmptyGame
			}
			mu.Unlock()
			return
		//This case	simply resets the timer every time a move is made by a player, otherwise, it times the game out
		case <-game.MsgChan:
			if !timeoutTimer.Stop() {
				<-timeoutTimer.C
				//game.P1Conn.WriteMessage(websocket.TextMessage, []byte("No one has made a move"))
			} else {
				timeoutTimer.Reset(200 * time.Second)
			}

		}
	}
}
