type Game = {
	P1Email: string,
	P2Email: string,

	P1Name: string,
	P2Name: string,
	
	RoomID:  string,
	Started: boolean,

	Locked:       boolean,
	CurrentTurn:   string,
	GetsFirstTurn: string,
	Fen:           string,
	EmailOfOneWhoMadeLastMove: string,
	DoesNotExistOrIsFull:  boolean,
	
	Winner: boolean,
}
export default Game;