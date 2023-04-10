type Game = {
	P1:      string,
	P2 :     string,
	RoomID:  string,
	P1Turn : boolean,
	Started: boolean,
	Locked : boolean,
    WhosTurn: string,
    Fen:       string,
	First:     string,
}
export default Game;