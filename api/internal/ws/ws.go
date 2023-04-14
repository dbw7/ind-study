package ws

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"independent-study-api/helper"
	"independent-study-api/internal/db"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"
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

	SomeoneWon bool

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
			conn.Close()
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
				}
				//else if &game.P2Conn != nil && *conn == game.P2Conn {
				//	fmt.Println("it is player 2's connection")
				//}
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
		response.EmailOfOneWhoMadeLastMove = event.EmailOfOneWhoMadeLastMove

		if event.EmailOfOneWhoMadeLastMove == connections[room].P1Email {
			response.CurrentTurn = connections[room].P2Email
		} else {
			response.CurrentTurn = connections[room].P1Email
		}
		connections[room].CurrentTurn = response.CurrentTurn
		connections[room].EmailOfOneWhoMadeLastMove = response.EmailOfOneWhoMadeLastMove
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
			connections[room].P1Conn.Close()
			connections[room].P2Conn.Close()
			delete(connections, room)
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

func handleContext(ctx context.Context, conn WebSocketConnection, game *Game) {
	//This is to timeout the game after both players have connected
	timeoutTimer := time.NewTimer(30 * time.Second)

	for {
		select {
		case <-ctx.Done():
			// If the context is canceled, end the loop
			fmt.Println("Connection closed by context")
			p1conn := game.P1Conn
			p2conn := game.P2Conn
			p1conn.Close()
			p2conn.Close()
			delete(connections, game.RoomID)
			return
		case <-timeoutTimer.C:
			mu.Lock()
			if !game.Started {
				//game.P1Conn.WriteMessage(websocket.TextMessage, []byte("Second player hasn't joined"))
				game.P1Conn.WriteJSON(map[string]interface{}{
					"noJoin": true,
				})
				game.P1Conn.Close()
				delete(connections, game.RoomID)
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
				game.P1Conn.Close()
				game.P2Conn.Close()
				delete(connections, game.RoomID)
			}
			mu.Unlock()
		case <-game.MsgChan:
			if !timeoutTimer.Stop() {
				<-timeoutTimer.C
				game.P1Conn.WriteMessage(websocket.TextMessage, []byte("No one has made a move"))
			} else {
				timeoutTimer.Reset(300 * time.Second)
			}

		}
	}
}
