import React, { useContext, useEffect, useState } from "react";
import Game from "../types/Game";
import wsMove from "../types/Move";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "../context/auth-context";
import config from "../config.json";

const useWebsocket = (room:string, email:string, authCtx:AuthContextType) => {
    const [playerNames, setPlayerNames] = useState({w: "", b: ""});
    const [game, setGame] = useState<Chess>(new Chess());
    const [socket, setSocket] = useState<WebSocket | null>();
    const [roomID, setRoomID] = useState<string>("");
    const [err, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [myTurn, setMyTurn] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [firstTurn, setFirstTurn] = useState<boolean>(true);
    const [fen, setFen] = useState<string>();
    const [lastResponseData, setLastResponseData] = useState<Game>();
    const [noJoin, setNoJoin] = useState<boolean>(false);
    //const [iWon, setIwon] = useState<boolean>(false);
    //const [winner, setWinner] = useState<string>("");
    //const [loser, setLoser] = useState<string>("");
    const [results, setResults] = useState<{winner: string, loser: string, iWon:boolean, tookTooLong:boolean, isDraw:boolean, myOpponent:string}>({winner: "", loser: "", iWon: false, tookTooLong: false, isDraw:false, myOpponent:""});
    
    const navigate = useNavigate();
    
    useEffect(()=>{
      	console.log(lastResponseData, "29292929")
      	if(lastResponseData?.isDraw){
			let myOpp = lastResponseData.P1Email == email ? lastResponseData.P2Name : lastResponseData.P1Name
			console.log("Setting draw")
			setResults((prevState)=>{
            	return {...prevState, isDraw: true, myOpponent: myOpp}
          	})
        	setRoomID("");
      	} else if(lastResponseData?.SomeoneWon){
        	if(lastResponseData.EmailOfOneWhoMadeLastMoveAKAWinner == lastResponseData.P1Email){
          		setResults((prevState)=>{
            	return {...prevState, winner: lastResponseData.P1Name, loser: lastResponseData.P2Name}})
			} else {
          		setResults((prevState)=>{
            		return {...prevState, winner: lastResponseData.P2Name, loser: lastResponseData.P1Name}})
        	}
        	if(lastResponseData.EmailOfOneWhoMadeLastMoveAKAWinner == email){
          		setResults((prevState)=>{
            		return {...prevState, iWon: true}
          		})
        	} else {
          		setResults((prevState)=>{
            		return {...prevState, iWon: false}
          		})
        	}
			setRoomID("");
    	}
	}, [lastResponseData])
    
    useEffect(()=>{
        if(!gameStarted || !myTurn || !socket || lastResponseData?.SomeoneWon){
          return
        }
        const possibleMoves = game.moves();
		if(game.isDraw()){
			let moveToSend:wsMove = JSON.parse(JSON.stringify(lastResponseData))
          	moveToSend.isDraw = true;
          	sendMsg(socket, moveToSend)
		}else if (game.isGameOver() || possibleMoves.length === 0){
          let moveToSend:wsMove = JSON.parse(JSON.stringify(lastResponseData))
          moveToSend.SomeoneWon = true;
          sendMsg(socket, moveToSend)
        };
    }, [game])
    
    
    const onDrop = (sourceSquare:any, targetSquare:any) => {
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
    moveToSend.EmailOfOneWhoMadeLastMoveAKAWinner = email;
    //console.log("sent data", moveToSend)
    sendMsg(socket, moveToSend)
    setMyTurn(false);
    //socket.send(JSON.stringify(moveToSend))
    //sendMsg(socket, moveToSend)
    setGame(gameCopy);
    //console.log("Game Fen 64", game.fen());
  }
  
  
    useEffect(()=>{
        //console.log("fen line 18", fen)
        //console.log("my turn in fen", myTurn)
        if(fen){
          const chess = new Chess(fen)
          setGame(chess);
        }
    }, [fen])
    
    const messageLogic = (socket:WebSocket) => {
        socket.onmessage = msg => {
          let data1 = JSON.parse(msg.data);
          if(data1.noJoin){
            console.log("noJoin", data1.noJoin)
			setNoJoin(true);
            return
          }
          if(data1.tookTooLong){
            handleTimeout(data1);
            setRoomID("");
            console.log("this player took too long", data1.tookTooLong)
            return
          }
          let data:Game = data1;
          if(data.DoesNotExistOrIsFull){
            navigate('/game?room=null')
          }
          //console.log("the data", data)
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
            //console.log("last response data", lastResponseData)
          } else {
            return
          }
        };
    }
    useEffect(()=>{
        if(!authCtx.isLoggedIn){
          navigate('/login')
          return
        }
        let ws:WebSocket;
        try {
          ws = new WebSocket(`${config.WS_URL}:${room}:${email}:${authCtx.token}`);
        } catch (error) {
          console.log("error connecting to ws", error)
          setError(true);
          return
        }
        ws.onopen = () => {
            console.log("Successfully Connected");
            setSocket(ws);
            messageLogic(ws);
            setError(false);
        };
        ws.onclose = event => {
            console.log("Socket Closed Connection: ", event);
            setSocket(null);
        };
        ws.onerror = error => {
            console.log("Socket Error: ", error);
            setSocket(null);
            setError(true);
            setGameStarted(false);
        };
        return () => {
            //console.log("remounting");
            ws.close();
            setSocket(null);
        };
      }, [])
    const handleTimeout = (data1:any) => {
		if(data1.tookTooLong == data1.P2Email){
        	setResults((prevState)=>{
            	return {...prevState, winner: data1.P1Name, loser: data1.P2Name}
            })
        } else {
        	setResults((prevState)=>{
            	return {...prevState, winner: data1.P2Name, loser: data1.P1Name}
            })
        }
        if(data1.tookTooLong != email){
        	setResults((prevState)=>{
              	return {...prevState, iWon: true, tookTooLong: true}
            })
        } else {
        	setResults((prevState)=>{
              	return {...prevState, iWon: false, tookTooLong: true}
            })
        }    
    }
    return {game, socket, roomID, err, errorMessage, gameStarted, firstTurn, onDrop, playerNames, noJoin, myTurn, results}
  
}



const sendMsg = (socket:WebSocket, move: wsMove) => {
    //console.log("sending")
    try {
      socket.send(JSON.stringify(move));
    } catch (error) {
      console.log("socket err 31", error)
    }
};

export default useWebsocket;