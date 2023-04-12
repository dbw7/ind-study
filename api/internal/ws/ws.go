package ws

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"independent-study-api/helper"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"sync"
)

var upgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Game struct {
	P1Email string
	P2Email string

	P1Name string
	P2Name string

	P1Conn WebSocketConnection
	P2Conn WebSocketConnection

	RoomID  string
	Started bool

	Locked                    bool
	CurrentTurn               string
	GetsFirstTurn             string
	Fen                       string
	EmailOfOneWhoMadeLastMove string

	DoesNotExistOrIsFull bool

	Winner bool
}
type wsPayload struct {
	Game
}
type wsJsonResponse struct {
	Game
}
type WebSocketConnection struct {
	*websocket.Conn
}

var wsChan = make(chan wsPayload)

// var games = make(map[WebSocketConnection]*Game)
var connections = make(map[string]*Game)

var mu sync.Mutex

func ServeWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgradeConnection.Upgrade(w, r, nil)

	roomID := chi.URLParam(r, "room")
	playerEmail := chi.URLParam(r, "player")
	fmt.Println(roomID)

	if strings.Compare("initial", roomID) == 0 {
		conn := WebSocketConnection{Conn: ws}
		freshRoom := freshRoomID()
		game := &Game{
			RoomID:  freshRoom,
			P1Email: playerEmail,
			P1Conn:  conn,
			Started: false,
			Locked:  false,
		}
		connections[freshRoom] = game
		conn.WriteJSON("You made a new room, id is")
		conn.WriteJSON(freshRoom)
		conn.WriteJSON(connections[freshRoom])
		go ListenForWs(&conn)
	} else {
		conn := WebSocketConnection{Conn: ws}
		if contains(connections, roomID) && len(connections[roomID].P2Email) == 0 {
			connections[roomID].P2Email = playerEmail
			connections[roomID].P2Conn = conn
			connections[roomID].Locked = true
			connections[roomID].Started = true

			if rand.Intn(2) == 0 {
				connections[roomID].GetsFirstTurn = connections[roomID].P2Email
				connections[roomID].CurrentTurn = connections[roomID].P2Email
			} else {
				connections[roomID].GetsFirstTurn = connections[roomID].P1Email
				connections[roomID].CurrentTurn = connections[roomID].P1Email
			}

			conn.WriteJSON(connections[roomID])
			connections[roomID].P1Conn.WriteJSON(connections[roomID])
			go ListenForWs(&conn)
		} else {
			game := &Game{
				DoesNotExistOrIsFull: true,
			}
			conn.WriteJSON(game)
			conn.Close()
		}
	}

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}

}

func ListenForWs(conn *WebSocketConnection) {
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
			fmt.Println("error", err)
			break
		} else {
			fmt.Println("Payload", payload)
			//sends this to the websocket channel
			wsChan <- payload
		}
	}
}

func ListenToWsChannel() {
	var response wsJsonResponse
	for {
		event := <-wsChan
		response = wsJsonResponse(event)
		room := event.RoomID
		fmt.Println("room", room)
		fmt.Println("event data", event)
		fmt.Println("response data", response)
		conn1 := connections[room].P1Conn
		conn2 := connections[room].P2Conn
		response.Fen = event.Fen
		response.Started = true
		response.RoomID = event.RoomID
		response.GetsFirstTurn = connections[room].GetsFirstTurn
		response.EmailOfOneWhoMadeLastMove = event.EmailOfOneWhoMadeLastMove

		if event.EmailOfOneWhoMadeLastMove == connections[room].P1Email {
			response.CurrentTurn = connections[room].P2Email
		} else {
			response.CurrentTurn = connections[room].P1Email
		}

		err := conn1.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
		err = conn2.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
	}
}

func freshRoomID() string {
	mu.Lock()
	defer mu.Unlock()
	randomString := helper.GenRandomString(3)
	for contains(connections, randomString) {
		randomString = helper.GenRandomString(3)
	}
	return randomString
}

func getCurrentRoomIDs() []string {
	keys := make([]string, len(connections))
	i := 0
	for k := range connections {
		keys[i] = k
		i++
	}
	return keys
}

func contains(mapx map[string]*Game, room string) bool {
	_, ok := mapx[room]
	if ok {
		return true
	} else {
		return false
	}
}
