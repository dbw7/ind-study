import React, { useState, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard"; 
import useWebsocket from "../../hooks/useWebSocket";
import AuthContext from "../../context/auth-context";
import './ChessBoard.css'
import { Typography } from "@mui/material";
import InvalidBox from "../Box/InvalidBox/InvalidBox";
import RoomBox from "../Box/RoomBox/RoomBox";
import ErrorBox from "../Box/ErrorBox/ErrorBox";
import ChessCountdown from "../ChessCountdown/ChessCountdown";
import { Navigate } from "react-router-dom";


interface props {
	room: string;
}

const ChessBoard = (props:props) => { 
  	const authCtx = useContext(AuthContext); 
  	const {game, firstTurn, onDrop, gameStarted, roomID, playerNames, err, noJoin, myTurn, results} = useWebsocket(props.room, authCtx.userData.email, authCtx)
  
  	useEffect(()=>{
    	//console.log("playernames", playerNames)
  	}, [props.room, gameStarted, playerNames])
  
  	return (
    	<>
      		{err && <ErrorBox></ErrorBox>}
      		{!err && (!props.room || (props.room.length != 3 && props.room != "initial") || props.room == "null") && <InvalidBox></InvalidBox>}
      		{(roomID && !gameStarted) && <RoomBox roomID={roomID} noJoin={noJoin}/>}
      		{
			//If there is no winner and no draw, show the board, otherwise, show the endgame box
			(results.winner.length < 2 && !results.isDraw)
			? 
			<div className="board">
        		{(gameStarted && !err) && 
					<>
						{/* {<><Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"500", display:"flex"}} variant="h6">{firstTurn ? playerNames.b : playerNames.w} {(!results.winner && !myTurn) && <ChessCountdown />}</Typography> </> } */}
						{<div style={{display:"flex"}}>{(!results.winner && !myTurn) &&<Typography fontFamily={"inter"} sx={{color:"white"}} variant="h3">&#x2022;</Typography>}<Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"500", display:"flex",  marginTop:"15px"}} variant="h6">{firstTurn ? playerNames.b : playerNames.w}{(!results.winner && !myTurn) && <ChessCountdown />}</Typography></div>}
						<Chessboard  boardOrientation={firstTurn ? "white" : "black"} position={game.fen()} onPieceDrop={onDrop} arePiecesDraggable={results.winner.length < 2} />
						{<div style={{display:"flex"}}>{(!results.winner && myTurn) &&<Typography fontFamily={"inter"} sx={{color:"white"}} variant="h3">&#x2022;</Typography>}<Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"500", display:"flex",  marginTop:"15px"}} variant="h6">{firstTurn ? playerNames.w : playerNames.b}{(!results.winner && myTurn) && <ChessCountdown />}</Typography></div>}
					</>
				}
				</div>
				: 
				<Navigate to="/end-game"  state={results}/>
			}
    </>
  )
}


export default ChessBoard;