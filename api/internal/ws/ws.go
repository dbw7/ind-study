package ws

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"independent-study-api/helper"
	"log"
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

type WsJsonResponse struct {
	Action       string `json:"action"`
	Message      string `json:"message"`
	MessageType  string `json:"message_type"`
	ReadyToStart bool   `json:"ready_to_start"`
	Room         string `json:"room"`
	Player1      string `json:"player1"`
}

var wsChan = make(chan WsPayload)

// var games = make(map[WebSocketConnection]*Game)
var connections = make(map[string]*Game)

var mu sync.Mutex

type Game struct {
	P1      string
	P2      string
	RoomID  string
	P1White bool
	Started bool
	P1Conn  WebSocketConnection
	P2Conn  WebSocketConnection
	Locked  bool
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
			P1White: true,
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
		if contains(connections, roomID) && !connections[roomID].Locked {
			connections[roomID].P2 = player
			connections[roomID].P2Conn = conn
			connections[roomID].Locked = true
			conn.WriteJSON(connections[roomID])
			connections[roomID].P1Conn.WriteJSON(connections[roomID])
			go ListenForWs(&conn)
		} else {
			conn.WriteJSON("Room is full or doesn't exist")
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
		fmt.Println("Payload", &payload)
		if err != nil {
			//do nothing, there is no payload
		} else {
			payload.Conn = *conn
			//sends this to the websocket channel
			wsChan <- payload
		}
	}
}

//func ListenToWsChannel() {
//	var response WsJsonResponse
//	for {
//		event := <-wsChan
//		switch event.Action {
//		case "username":
//			//Get list of all users and send back via broadcast
//
//		case "left":
//			response.Action = "list_users"
//
//		case "broadcast":
//			response.Action = "broadcast"
//			response.Message = fmt.Sprintf("<strong>%s</strong>: %s", event.Username, event.Message)
//
//		}
//		//response.Action = "Got here"
//		//response.Message = fmt.Sprintf("Some message and action was %s", event.Action)
//		//broadCastToAll(response)
//	}
//}

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
