package db

type DBGame struct {
	P1Email string
	P2Email string

	P1Name string
	P2Name string

	RoomID string

	Result  string
	Winner  string
	Quitter string

	P1Rating int
	P2Rating int
}
