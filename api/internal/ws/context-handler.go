package ws

import (
	"context"
	"fmt"
	"independent-study-api/helper"
	"independent-study-api/internal/db"
	"time"
)

func handleContext(ctx context.Context, conn WebSocketConnection, game *Game) {
	//This is to timeout the game after both players have connected
	timeoutTimer := time.NewTimer(60 * time.Second)

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

				game.CancelContext()

				safelyCloseConnections(game.P1Conn, game.P2Conn, "handleContext 29")
				delete(connections, game.RoomID)
				game.GameInstance = *EmptyGameInstance
				game = EmptyGame
			} else {
				whoHasCurrentTurn := game.CurrentTurn
				game.GameInstance.Result = whoHasCurrentTurn + " Took too long"
				var actualOutcome float64
				var p1Won bool
				if whoHasCurrentTurn == game.P1Email {
					p1Won = false
					game.GameInstance.Winner = game.P2Name
					game.GameInstance.Loser = game.P1Name
					actualOutcome = 0
				} else {
					game.GameInstance.Winner = game.P1Name
					game.GameInstance.Loser = game.P2Name
					actualOutcome = 1
					p1Won = true
				}

				rating1Int, rating2Int, elo1Change, elo2Change := helper.UpdateElo(game.P1Rating, game.P2Rating, actualOutcome)

				game.P1Conn.WriteJSON(map[string]interface{}{
					"tookTooLong": whoHasCurrentTurn,
					"P1Name":      game.P1Name,
					"P2Name":      game.P2Name,
					"P1Email":     game.P1Email,
					"P2Email":     game.P2Email,
					"NewP1Rating": rating1Int,
					"NewP2Rating": rating2Int,
					"P1EloChange": elo1Change,
					"P2EloChange": elo2Change,
				})
				game.P2Conn.WriteJSON(map[string]interface{}{
					"tookTooLong": whoHasCurrentTurn,
					"P1Name":      game.P1Name,
					"P2Name":      game.P2Name,
					"P1Email":     game.P1Email,
					"P2Email":     game.P2Email,
					"NewP1Rating": rating1Int,
					"NewP2Rating": rating2Int,
					"P1EloChange": elo1Change,
					"P2EloChange": elo2Change,
				})

				game.GameInstance.NewP1Rating = rating1Int
				game.GameInstance.NewP2Rating = rating2Int
				game.GameInstance.P1EloChange = elo1Change
				game.GameInstance.P2EloChange = elo2Change
				game.GameInstance.Result = game.GameInstance.Winner + " won by timeout " + game.GameInstance.Loser + " took too long to make a move."
				db.CreateOrUpdateGame(game.GameInstance, true, p1Won, false)

				game.CancelContext()

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
				timeoutTimer = time.NewTimer(135 * time.Second)
			}

		}
	}
}
