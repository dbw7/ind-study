import styled from "@emotion/styled";
import { ThemeProvider, Typography } from "@mui/material";
import React, { FC } from "react";
import "./Game.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";


const Game: FC = () => {
    return(
        <div className="board-big">
            <div className="board">
                <ChessBoard></ChessBoard>
            </div>
        </div>
    )
}

export default Game;