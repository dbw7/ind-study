import styled from "@emotion/styled";
import { ThemeProvider, Typography } from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import "./Game.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import AuthContext from "../../context/auth-context";
import { useSearchParams } from "react-router-dom";


const Game: FC = () => {
    // @ts-ignore
    const [queryParams] = useSearchParams();
    let roomQuery = queryParams.get("room");
    
    if(!roomQuery){
        roomQuery = "";
    }
    
    return(
        <div>
            <ChessBoard room={roomQuery}></ChessBoard>
        </div>
    )
}

export default Game;