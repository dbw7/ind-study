import styled from "@emotion/styled";
import { ThemeProvider, Typography } from "@mui/material";
import React, { FC, useContext } from "react";
import "./Game.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import AuthContext from "../../context/auth-context";
import { useSearchParams } from "react-router-dom";


const Game: FC = () => {
    // @ts-ignore
    const [queryParams] = useSearchParams();
    let room = queryParams.get("room")
    
    return(
        <div className="board-big">
            <div className="board">
                <ChessBoard room={room}></ChessBoard>
            </div>
        </div>
    )
}

export default Game;