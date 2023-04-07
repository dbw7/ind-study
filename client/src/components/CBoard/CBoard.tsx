import React, { useState } from "react";
import {Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard"; 

const CBoard = () => { 
  const [game, setGame] = useState(new Chess());
  const [first, setFirst] = useState(true);
  
  console.log(first)
  if (first){
    game.load("rnbqkbnr/pp1ppppp/8/2p5/4P1Q1/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2")
    setFirst(false);
    console.log(first)
  }
  
  function makeMove(move:any) {
    console.log(game.pgn)
    console.log(typeof move)
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0){
      console.log("game is over");
      window.alert("game is over")
    };
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    gameCopy.move(move);
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
            <Chessboard boardOrientation="black" position={game.fen()} onPieceDrop={onDrop} />
        </div>
    )
}


export default CBoard;