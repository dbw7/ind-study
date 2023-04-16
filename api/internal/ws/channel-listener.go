package ws

import (
	"fmt"
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
		connections[room].mu.Lock()
		fmt.Println("event data", event)
		fmt.Println("response data", response)
		conn1 := connections[room].P1Conn
		conn2 := connections[room].P2Conn
		response.Fen = event.Fen
		response.Started = true
		response.RoomID = event.RoomID
		response.GetsFirstTurn = connections[room].GetsFirstTurn
		response.EmailOfOneWhoMadeLastMoveAKAWinner = event.EmailOfOneWhoMadeLastMoveAKAWinner

		if event.EmailOfOneWhoMadeLastMoveAKAWinner == connections[room].P1Email {
			response.CurrentTurn = connections[room].P2Email
		} else {
			response.CurrentTurn = connections[room].P1Email
		}
		connections[room].CurrentTurn = response.CurrentTurn
		connections[room].EmailOfOneWhoMadeLastMoveAKAWinner = response.EmailOfOneWhoMadeLastMoveAKAWinner
		connections[room].mu.Unlock()
		err := conn1.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
		err = conn2.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
		if event.SomeoneWon {
			safelyCloseConnections(connections[room].P1Conn, connections[room].P2Conn, "channel 47")
			delete(connections, room)
		}
	}
}
