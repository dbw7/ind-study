import React, { useState } from "react";
import {Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard"; 

const CBoard = () => { 
  const [game, setGame] = useState(new Chess());

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
            <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
    )
}


export default CBoard;