package ws

import (
	"independent-study-api/helper"
	"log"
)

func contains(mapx map[string]*Game, room string) bool {
	_, ok := mapx[room]
	if ok {
		return true
	} else {
		return false
	}
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

func freshRoomID() string {
	mu.Lock()
	defer mu.Unlock()
	randomString := helper.GenRandomString(3)
	for contains(connections, randomString) {
		randomString = helper.GenRandomString(3)
	}
	return randomString
}

func safelyCloseConnections(p1Conn WebSocketConnection, p2Conn WebSocketConnection, ref string) {
	if p1Conn.Conn != nil {
		err := p1Conn.Conn.Close()
		if err != nil {
			log.Println(ref, "Error closing connection p1", err)
		}
	}
	if p2Conn.Conn != nil {
		err := p2Conn.Conn.Close()
		if err != nil {
			log.Println(ref, "Error closing connection p2", err)
		}
	}
}

func AuthWebsocket(token string) bool {
	_, worked := helper.ParseToken(token)
	if worked {
		return true
	} else {
		return false
	}
}
