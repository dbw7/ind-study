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

type WebSocketConnection struct {
	*websocket.Conn
}

var wsChan = make(chan WsPayload)

// var games = make(map[WebSocketConnection]*Game)
var connections = make(map[string]*Game)

var mu sync.Mutex

type Game struct {
	P1       string
	P2       string
	RoomID   string
	P1Turn   bool
	Started  bool
	P1Conn   WebSocketConnection
	P2Conn   WebSocketConnection
	Locked   bool
	WhosTurn string
	First    string
}

func ServeWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgradeConnection.Upgrade(w, r, nil)

	roomID := chi.URLParam(r, "room")
	player := chi.URLParam(r, "player")
	_ = player
	fmt.Println(roomID)

	if strings.Compare("initial", roomID) == 0 {
		conn := WebSocketConnection{Conn: ws}
		freshRoom := freshRoomID()
		game := &Game{
			RoomID:  freshRoom,
			P1:      player,
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
		if contains(connections, roomID) && len(connections[roomID].P2) == 0 {
			connections[roomID].P2 = player
			connections[roomID].P2Conn = conn
			connections[roomID].Locked = true
			connections[roomID].Started = true

			if (rand.Intn(2) == 0) {
				connections[roomID].First = connections[roomID].P2
				connections[roomID].WhosTurn = connections[roomID].P2
			} else {
				connections[roomID].First = connections[roomID].P1
				connections[roomID].WhosTurn = connections[roomID].P1
			}

			conn.WriteJSON(connections[roomID])
			connections[roomID].P1Conn.WriteJSON(connections[roomID])
			go ListenForWs(&conn)
		} else {
			conn.WriteJSON("Room is full or doesn't exist")
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

type WsPayload struct {
	Move    string              `json:"move"`
	Fen     string              `json:"fen"`
	Room    string              `json:"room"`
	Action  string              `json:"action"`
	Player  string              `json:"player"`
	Email   string              `json:"email"`
	Message string              `json:"message"`
	Conn    WebSocketConnection `json:"-"`
}

func ListenForWs(conn *WebSocketConnection) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Error", fmt.Sprintf("%v", r))
		}
	}()
	var payload WsPayload
	for {
		err := conn.ReadJSON(&payload)
		if err != nil {
			//do nothing, there is no payload
			fmt.Println("error", err)
			break
		} else {
			fmt.Println("Payload", payload)
			payload.Conn = *conn
			//sends this to the websocket channel
			wsChan <- payload
		}
	}
}

type WsJsonResponse struct {
	Action       string
	Message      string
	MessageType  string
	ReadyToStart bool
	RoomID       string
	WhosTurn     string
	Fen          string
	Started      bool
	First        string
}

func ListenToWsChannel() {
	var response WsJsonResponse
	for {
		event := <-wsChan
		room := event.Room
		fmt.Println("room", room)
		conn1 := connections[room].P1Conn
		conn2 := connections[room].P2Conn
		response.Fen = event.Fen
		response.Started = true
		response.RoomID = event.Room
		response.First = connections[room].First
		if event.Email == connections[room].P1 {
			response.WhosTurn = connections[room].P2
		} else {
			response.WhosTurn = connections[room].P1
		}
		err := conn1.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
		err = conn2.WriteJSON(response)
		if err != nil {
			log.Println("Websocket err")
		}
		//response.Action = "Got here"
		//response.Message = fmt.Sprintf("Some message and action was %s", event.Action)
		//broadCastToAll(response)
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
