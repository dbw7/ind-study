import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard"; 
import useWebsocket from "../../hooks/useWebSocket";
import AuthContext from "../../context/auth-context";
import {Chess, Move } from "chess.js";
import { Typography } from "@mui/material";
import './ChessBoard.css'
import { textAlign } from "@mui/system";

const ChessBoard = (props:any) => { 
  const authCtx = useContext(AuthContext);  
  console.log(props.room)
  const {game, firstTurn, onDrop, gameStarted, roomID} = useWebsocket(props.room, authCtx.userData.email)
  
  return (
    <>
      {!gameStarted && 
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