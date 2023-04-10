import React, { useState, useEffect, useContext } from "react";
import {Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard"; 
import { sendMsg } from "../../api";
import CMove from "../../types/Move";
import AuthContext from "../../context/auth-context";

const ChessBoard = (props:any) => { 
  const [socket, setSocket] = useState<WebSocket | null>(null);

  let room:string = props.room;
  const authCtx = useContext(AuthContext);
  
  useEffect(()=>{
    if(authCtx.socket){
      setSocket(authCtx.socket)
    }
    console.log("socket here", socket)
  }, [authCtx.socket])
  
  const [game, setGame] = useState(new Chess());
  const [first, setFirst] = useState(true);
  
  useEffect(()=>{
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0){
      console.log("game is over");
      window.alert("game is over")
    };
  }, [game])
  
  function makeMove(move:any) {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    gameCopy.move(move);
    let moveToSend:CMove = {
      room: room,
      fen: gameCopy.fen(),
      player: authCtx.userData.name,
      email: authCtx.userData.email,
      move
    }
    if(socket){
      socket.send(JSON.stringify(moveToSend))
    } else {
      console.log("socket is not initalized")
    }
    //sendMsg(socket, moveToSend)
    setGame(gameCopy);
    console.log(game.board());
    console.log(game.fen());
  }
  
  function onDrop(sourceSquare:any, targetSquare:any) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    setTimeout(makeMove, 200);
    return true;
  }
  
    return (
        <div>
            <Chessboard boardOrientation="white" position={game.fen()} onPieceDrop={onDrop} />
        </div>
    )
}


export default ChessBoard;