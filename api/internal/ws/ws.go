package ws

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"independent-study-api/internal/db"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"sync"
)

var upgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return origin == os.Getenv("CLIENT_URL")
	},
}

type Game struct {
	P1Email string
	P2Email string

	P1Name string
	P2Name string

	P1Rating    int
	P2Rating    int
	P2EloChange int
	P1EloChange int
	P1Rank      int
	P2Rank      int
	NewP1Rating int
	NewP2Rating int
	P1Conn      WebSocketConnection
	P2Conn      WebSocketConnection

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
	IsDraw      bool `json:"isDraw"`

	MsgChan       chan string        `json:"-"`
	GameInstance  db.DBGame          `json:"-"`
	CancelContext context.CancelFunc `json:"-"`
}

var (
	EmptyGame         = &Game{}
	EmptyGameInstance = &db.DBGame{}
)

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
	token := chi.URLParam(r, "token")
	if !AuthWebsocket(token) {
		return
	}
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
		p1Name, p1Rank, p1Rating := db.GetUsersNameRankAndRating(playerEmail)
		game := &Game{
			RoomID:        freshRoom,
			P1Email:       playerEmail,
			P1Conn:        conn,
			Started:       false,
			Locked:        false,
			P1Name:        p1Name,
			MsgChan:       make(chan string),
			P1Rank:        p1Rank,
			P1Rating:      p1Rating,
			CancelContext: cancel,
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
			mu.Lock()
			p2Name, p2Rank, p2Rating := db.GetUsersNameRankAndRating(playerEmail)
			connections[roomID].P2Email = playerEmail
			connections[roomID].P2Conn = conn
			connections[roomID].Locked = true
			connections[roomID].Started = true
			connections[roomID].P2Name = p2Name
			connections[roomID].P2Rank = p2Rank
			connections[roomID].P2Rating = p2Rating
			if rand.Intn(2) == 0 {
				connections[roomID].GetsFirstTurn = connections[roomID].P2Email
				connections[roomID].CurrentTurn = connections[roomID].P2Email
			} else {
				connections[roomID].GetsFirstTurn = connections[roomID].P1Email
				connections[roomID].CurrentTurn = connections[roomID].P1Email
			}
			gameInstance := &db.DBGame{
				ID: primitive.NewObjectID(),

				P1Email: connections[roomID].P1Email,
				P2Email: connections[roomID].P2Email,

				P1Name: connections[roomID].P1Name,
				P2Name: connections[roomID].P2Name,

				RoomID: connections[roomID].RoomID,

				OldP1Rating: connections[roomID].P1Rating,
				OldP2Rating: connections[roomID].P2Rating,

				P1Rank: connections[roomID].P1Rank,
				P2Rank: connections[roomID].P2Rank,
			}
			db.CreateOrUpdateGame(*gameInstance, false, false, false)
			connections[roomID].GameInstance = *gameInstance

			conn.WriteJSON(connections[roomID])
			connections[roomID].P1Conn.WriteJSON(connections[roomID])
			mu.Unlock()
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
			mu.Lock()
			delete(connections, roomID)
			game = EmptyGame
			mu.Unlock()
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
