import React, { useState } from "react";
import Tile from "../Tile/Tile";
import './Board.css';


const verticalAxis = ["1","2","3","4","5","6","7","8"]
const horizontalAxis = ["a", "b", "c","d","e,","f","g","h"]

type Tilex =  {
    occupiedBy: number,
    coordinate: string
}

const setInitialBoardMap = () => {
    let initialBoard = {};
    
}

const Board = () => {
    const [board, setBoard] = useState();
    
    return(
        <div className="board-bg">
            <div className="board">
                {/* <div className="piece"><img className="board-piece" src={kb}></img></div> */}
                {/* {boardx.map( tile =>
                    <Tile key={tile.coordinate} tile={tile}></Tile>
                )} */}
                {}
            </div>
        </div>
    )
}

export default Board;