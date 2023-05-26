## Website can be found at dbchess.org

This is a real-time chess playing website using Golang and React with TypeScript.

It is handled through a Golang server running Go-Chi and Gorilla-websockets.

The Golang backend is hosted on [render](https://render.com/).<br>
The frontend is a React site built using TypeScript and hosted on Firebase.

I built JWT tokens using information from Microsoft's graph API for authentication, essentially Microsoft login.

I use MongoDB as my database.

The chessboard visual is through [React Chessboard](https://www.npmjs.com/package/react-chessboard).<br>
The chessboard logic is through [Chess JS](https://github.com/jhlywa/chess.js/blob/master/README.md).
