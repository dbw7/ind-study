import React, { useEffect, useState } from "react";
import Game from "../types/Game";
import wsMove from "../types/Move";
import { Chess, Move } from "chess.js";
import { useNavigate } from "react-router-dom";

  
const useWebsocket = (room:string, email:string) => {
    const [playerNames, setPlayerNames] = useState({w: "", b: ""});
    const [game, setGame] = useState<Chess>(new Chess());
    const [socket, setSocket] = useState<WebSocket | null>();
    const [roomID, setRoomID] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [myTurn, setMyTurn] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [firstTurn, setFirstTurn] = useState<boolean>(true);
    const [fen, setFen] = useState<string>();
    const [lastResponseData, setLastResponseData] = useState<Game>();
    const [winner, setWinner] = useState<string>("");
    const navigate = useNavigate();
    
    
    useEffect(()=>{
      if(lastResponseData?.SomeoneWon){
        let message;
        lastResponseData.EmailOfOneWhoMadeLastMove == lastResponseData.P1Email ? message = lastResponseData.P1Name + " won!!!!!" : message = lastResponseData.P2Name + " won!!!!"
        setWinner(message);
        setRoomID("");
      }
    }, [lastResponseData])
    
    useEffect(()=>{
        if(!gameStarted || !myTurn || !socket || lastResponseData?.SomeoneWon){
          return
        }
        const possibleMoves = game.moves();
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0){
          let moveToSend:wsMove = JSON.parse(JSON.stringify(lastResponseData))
          moveToSend.SomeoneWon = true;
          sendMsg(socket, moveToSend)
        };
    }, [game])
    
    
    const  onDrop = (sourceSquare:any, targetSquare:any) => {
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
    
    const makeMove =(move:any) => {
        if(!socket){
            console.log("no socket")
            setError(true);
            setErrorMessage("You're not connected to a socket");
            return
        }
        if(!myTurn){
            return
        }
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        gameCopy.move(move);
    if(!roomID){
        setError(true);
        setErrorMessage("Not in a room");
        console.log("no room", roomID);
        return
    }
    let moveToSend:wsMove = JSON.parse(JSON.stringify(lastResponseData))
    moveToSend.RoomID = roomID
    moveToSend.Fen = gameCopy.fen()
    moveToSend.EmailOfOneWhoMadeLastMove = email;
    console.log("sent data", moveToSend)
    sendMsg(socket, moveToSend)
    setMyTurn(false);
    //socket.send(JSON.stringify(moveToSend))
    //sendMsg(socket, moveToSend)
    setGame(gameCopy);
    console.log("Game Fen 64", game.fen());
  }
  
  
    useEffect(()=>{
        console.log("fen line 18", fen)
        console.log("my turn in fen", myTurn)
        if(fen){
          const chess = new Chess(fen)
          setGame(chess);
        }
    }, [fen])
    
    const messageLogic = (socket:WebSocket) => {
        socket.onmessage = msg => {
          let data:Game = JSON.parse(msg.data);
          if(data.DoesNotExistOrIsFull){
            navigate('/game?room=null')
          }
          console.log("the data", data)
          setRoomID(data.RoomID);
          if(data.Started && !gameStarted){
            setGameStarted(true);
            
            let w = data.GetsFirstTurn == data.P1Email ? data.P1Name : data.P2Name;
            let b = data.GetsFirstTurn == data.P1Email ? data.P2Name : data.P1Name;
            setPlayerNames({w: w, b: b});
            
            if(data.GetsFirstTurn == email){
                setFirstTurn(true);
            } else {
                setFirstTurn(false); 
            }
            if(data.CurrentTurn == email){
                setMyTurn(true)
            } else {
                setMyTurn(false)
            }
            setFen(data.Fen);
            setLastResponseData(data);
            console.log("last response data", lastResponseData)
          } else {
            return
          }
        };
    }
    useEffect(()=>{
        let ws = new WebSocket(`ws://localhost:8080/ws:${room}:${email}`);
        ws.onopen = () => {
            console.log("Successfully Connected");
            setSocket(ws);
            messageLogic(ws);
        };
        ws.onclose = event => {
            console.log("Socket Closed Connection: ", event);
            setSocket(null);
        };
        ws.onerror = error => {
            console.log("Socket Error: ", error);
            setSocket(null);
            setError(true);
        };
        return () => {
            ws.close();
            setSocket(null);
        };
      }, [])
    return {game, socket, roomID, error, errorMessage, gameStarted, firstTurn, onDrop, winner, playerNames}
  
}

const sendMsg = (socket:WebSocket, move: wsMove) => {
    console.log("sending")
    try {
      socket.send(JSON.stringify(move));
    } catch (error) {
      console.log("socket err 31", error)
    }
};

export default useWebsocket;