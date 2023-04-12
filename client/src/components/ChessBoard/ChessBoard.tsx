import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard"; 
import useWebsocket from "../../hooks/useWebSocket";
import AuthContext from "../../context/auth-context";
import './ChessBoard.css'

import { Button, ButtonProps, ThemeProvider, Typography, styled} from "@mui/material";
import InvalidBox from "../Box/InvalidBox";
import RoomBox from "../Box/RoomBox";

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
  const {game, firstTurn, onDrop, gameStarted, roomID} = useWebsocket(props.room, authCtx.userData.email)
  
  useEffect(()=>{
    console.log("this fired", props.room)
  }, [props.room])
  
  return (
    <>
    {(!props.room || (props.room.length != 3 && props.room != "initial") || props.room == "null") && <InvalidBox></InvalidBox>}
      {(roomID && !gameStarted) && <RoomBox roomID={roomID}/>}
      <div className="board">
        {gameStarted && <Chessboard  boardOrientation={firstTurn ? "white" : "black"} position={game.fen()} onPieceDrop={onDrop} />}
      </div>
    </>
  )
}


export default ChessBoard;