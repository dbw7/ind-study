import styled from "@emotion/styled";
import { ThemeProvider, Typography } from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import "./Game.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import AuthContext from "../../context/auth-context";
import { useSearchParams } from "react-router-dom";
import useBackendTester from "../../hooks/useBackendTester";


const Game: FC = () => {
    // @ts-ignore
    useBackendTester();
    const [queryParams] = useSearchParams();
    let roomQuery = queryParams.get("room");
    
    
    if(!roomQuery){
        roomQuery = "";
    } else {
        roomQuery = roomQuery?.toLocaleLowerCase();
    }
    
    return(
        <div>
            <ChessBoard room={roomQuery}></ChessBoard>
        </div>
    )
}

export default Game;