import styled from "@emotion/styled";
import { ThemeProvider, Typography } from "@mui/material";
import React, { FC, useContext } from "react";
import "./Game.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import { connect } from "../../api";
import AuthContext from "../../context/auth-context";


const Game: FC = () => {
    // @ts-ignore
    return(
        <div className="board-big">
            <div className="board">
                <ChessBoard room="ozm"></ChessBoard>
            </div>
        </div>
    )
}

export default Game;