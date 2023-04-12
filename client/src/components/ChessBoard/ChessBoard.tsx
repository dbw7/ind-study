import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard"; 
import useWebsocket from "../../hooks/useWebSocket";
import AuthContext from "../../context/auth-context";
import './ChessBoard.css'

import { Button, ButtonProps, ThemeProvider, Typography, styled} from "@mui/material";

interface props {
  room: string;
}
const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
  backgroundImage: "linear-gradient( 83.2deg,  rgba(150,93,233,1) 10.8%, rgba(99,88,238,1) 94.3% )",
  '&:hover': {
      backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
  },
}));

const ChessBoard = (props:props) => { 
  const authCtx = useContext(AuthContext);  
  console.log(props.room)
  const {game, firstTurn, onDrop, gameStarted, roomID} = useWebsocket(props.room, authCtx.userData.email)
  
  return (
    <>
    {(props.room == null || props.room.length < 1 || props.room == "invalid") && 
      <div className="invalid-box">
      <div style={{textAlign:"center"}}>
        <Typography  color="#e9b14a" fontFamily={"inter"} fontWeight="700" variant="h4" >The room you tried to access is full or doesn't exist.</Typography>
        <br></br>
        <br></br>
        <br></br>
        <div className="code">
          <Typography  color="#e9b14a" fontFamily={"inter"} fontWeight="700" variant="h4" >Want to start a game? Click here.</Typography>
        </div>
        <br></br>
        <ColorButton><Typography  color="white" fontFamily={"inter"} fontWeight="700" variant="h6" >Create Game</Typography></ColorButton>
      </div>
    </div>}
      {(roomID && !gameStarted) && 
      <div className="room-box">
      <div style={{textAlign:"center"}}>
        <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >Room Code:</Typography>
        <div className="code">
          <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >{roomID}</Typography>
        </div>
      </div>
    </div>}
      <div className="board">
        {gameStarted && <Chessboard  boardOrientation={firstTurn ? "white" : "black"} position={game.fen()} onPieceDrop={onDrop} />}
      </div>
    </>
  )
}


export default ChessBoard;