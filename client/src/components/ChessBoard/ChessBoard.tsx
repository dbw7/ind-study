import React, { useState, useEffect, useContext } from "react";
import {Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard"; 
import CMove from "../../types/Move";
import AuthContext, { AuthContextType } from "../../context/auth-context";
import { connect, sendMsgx } from "../../api";
import Game from "../../types/Game";



const ChessBoard = (props:any) => { 
  const authCtx = useContext(AuthContext);
  const [socket, setSocket] = useState<WebSocket>()
  const [myTurn, setMyTurn] = useState<Boolean>(false);
  const [game, setGame] = useState(new Chess());
  const [roomxx, setRoom] = useState("");
  const [fen, setFen] = useState<string>("");
  const [first, setFirst] = useState<string>("");
  
  const messageLogic = (socket:WebSocket) => {
    socket.onmessage = msg => {
      let data:Game = JSON.parse(msg.data);
      console.log("the data", data)
      console.log("data room id",roomxx);
      setRoom(data.RoomID);
      if(data.Started){
        setFirst(data.First);
        console.log("whos", data.WhosTurn == authCtx.userData.email)
        if(data.WhosTurn == authCtx.userData.email){
          setMyTurn(true)
        } else {
          setMyTurn(false);
        }
        console.log("fen", data.Fen)
        if(data.Fen){
          setFen(data.Fen)
        }
      }
      //cb(msg);
    };
  }
  
  let room:string = props.room;
  console.log("my turn", myTurn)
  useEffect(()=>{
    let socketx = new WebSocket(`ws://localhost:8080/ws:${room}:${authCtx.userData.email}`);
    connect(socketx);
    setSocket(socketx)
    messageLogic(socketx);
  }, [])
  
 useEffect(()=>{
  console.log("fen 50", fen)
  if(fen){
    const chess = new Chess(
      fen
    )
    setGame(chess);
  }
 }, [fen])
  
  useEffect(()=>{
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0){
      console.log("game is over");
      window.alert("game is over")
    };
  }, [game])
  
  function makeMove(move:any) {
    if(!socket){
      console.log("no socket")
      return
    }
    if(!myTurn){
      return
    }
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    gameCopy.move(move);
    if(!roomxx){
      console.log("no room", roomxx);
      return
    }
    let moveToSend:CMove = {
      room: roomxx,
      fen: gameCopy.fen(),
      player: authCtx.userData.name,
      email: authCtx.userData.email,
      move: ""
    }
    sendMsgx(socket, moveToSend)
    setMyTurn(false);
    //socket.send(JSON.stringify(moveToSend))
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
            <Chessboard boardOrientation={first === authCtx.userData.email ? "white" : "black"} position={game.fen()} onPieceDrop={onDrop} />
        </div>
    )
}


export default ChessBoard;