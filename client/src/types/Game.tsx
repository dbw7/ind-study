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
	EmailOfOneWhoMadeLastMoveAKAWinner: string,
	DoesNotExistOrIsFull:  boolean,
	
	SomeoneWon: boolean,
	SomeoneQuit: boolean,
	isDraw: boolean,
	
	P1Rating: string,
	P2Rating: string,
	P1EloChange: string,
	P2EloChange: string,
	NewP1Rating: string,
	NewP2Rating: string,
	tookTooLong:string
}
export default Game;