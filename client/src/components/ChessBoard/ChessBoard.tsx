import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard"; 
import useWebsocket from "../../hooks/useWebSocket";
import AuthContext from "../../context/auth-context";
import './ChessBoard.css'

import { Button, ButtonProps, ThemeProvider, Typography, styled} from "@mui/material";
import InvalidBox from "../Box/InvalidBox";
import RoomBox from "../Box/RoomBox";
import ErrorBox from "../Box/ErrorBox";

interface props {
  room: string;
}

const ChessBoard = (props:props) => { 
  const authCtx = useContext(AuthContext); 
  const {game, firstTurn, onDrop, gameStarted, roomID, winner, playerNames, error} = useWebsocket(props.room, authCtx.userData.email)
  
  useEffect(()=>{
    console.log("playernames", playerNames)
  }, [props.room, gameStarted, playerNames])
  
  return (
    <>
    {error && <ErrorBox></ErrorBox>}
    <Typography variant="h1">{winner}</Typography>
    {!error && (!props.room || (props.room.length != 3 && props.room != "initial") || props.room == "null") && <InvalidBox></InvalidBox>}
      {(roomID && !gameStarted) && <RoomBox roomID={roomID}/>}
      <div className="board">
        {gameStarted && 
        <>
          {firstTurn ? playerNames.b : playerNames.w}
          <Chessboard  boardOrientation={firstTurn ? "white" : "black"} position={game.fen()} onPieceDrop={onDrop} arePiecesDraggable={winner.length < 2} />
          {firstTurn ? playerNames.w : playerNames.b}
        </>}
      </div>
    </>
  )
}


export default ChessBoard;