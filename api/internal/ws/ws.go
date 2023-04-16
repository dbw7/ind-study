package ws

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"independent-study-api/internal/db"
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

	Locked                             bool
	CurrentTurn                        string
	GetsFirstTurn                      string
	Fen                                string
	EmailOfOneWhoMadeLastMoveAKAWinner string

	DoesNotExistOrIsFull bool

	SomeoneWon  bool
	SomeoneQuit bool
	IsDraw      bool

	MsgChan chan string `json:"-"`
	mu      sync.Mutex  `json:"-"`
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
	var ctx context.Context
	var cancel context.CancelFunc

	roomID := chi.URLParam(r, "room")
	playerEmail := chi.URLParam(r, "player")
	fmt.Println(roomID)

	if strings.Compare("initial", roomID) == 0 {
		conn := WebSocketConnection{Conn: ws}
		ctx, cancel = context.WithCancel(context.Background())
		defer cancel()
		freshRoom := freshRoomID()
		p1Name := db.GetUsersName(playerEmail)
		game := &Game{
			RoomID:  freshRoom,
			P1Email: playerEmail,
			P1Conn:  conn,
			Started: false,
			Locked:  false,
			P1Name:  p1Name,
			MsgChan: make(chan string),
		}
		connections[freshRoom] = game
		conn.WriteJSON("You made a new room, id is")
		conn.WriteJSON(freshRoom)
		conn.WriteJSON(connections[freshRoom])
		go ListenForWs(&conn, connections[freshRoom])
		handleContext(ctx, conn, connections[freshRoom])
	} else {
		conn := WebSocketConnection{Conn: ws}
		if contains(connections, roomID) && len(connections[roomID].P2Email) == 0 {
			connections[roomID].mu.Lock()
			p2Name := db.GetUsersName(playerEmail)
			connections[roomID].P2Email = playerEmail
			connections[roomID].P2Conn = conn
			connections[roomID].Locked = true
			connections[roomID].Started = true
			connections[roomID].P2Name = p2Name
			if rand.Intn(2) == 0 {
				connections[roomID].GetsFirstTurn = connections[roomID].P2Email
				connections[roomID].CurrentTurn = connections[roomID].P2Email
			} else {
				connections[roomID].GetsFirstTurn = connections[roomID].P1Email
				connections[roomID].CurrentTurn = connections[roomID].P1Email
			}

			conn.WriteJSON(connections[roomID])
			connections[roomID].P1Conn.WriteJSON(connections[roomID])
			connections[roomID].mu.Unlock()
			go ListenForWs(&conn, connections[roomID])
		} else {
			game := &Game{
				DoesNotExistOrIsFull: true,
			}
			if ctx != nil {
				cancel()
			}
			conn.WriteJSON(game)
			safelyCloseConnections(game.P1Conn, game.P2Conn, "126")
		}
	}

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
			if ctx != nil {
				cancel()
			}
		}
		return
	}
}
