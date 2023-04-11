import styled from "@emotion/styled";
import { Button, TextField, ThemeProvider, Typography } from "@mui/material";
import React, { BaseSyntheticEvent, ChangeEvent, FC, SyntheticEvent, useContext, useState } from "react";
import "./CreateGame.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import AuthContext from "../../context/auth-context";
import { redirect, useNavigate } from "react-router-dom";


const CreateGame: FC = () => {
    const [room, setRoom] = useState();
    const navigate = useNavigate();
    const createGame = () => {
        navigate('/game?room=initial')
    }
    // const joinGame = () => {
    //     socket = connect("mr8", authCtx.userData.email)
    //     authCtx.socket = socket
    // }
    const handleTextInputChange = (event:BaseSyntheticEvent) => {
        console.log(event)
        setRoom(event.target.value);
    };
    const joinGame = () => {
        navigate('/game?room='+room)
    }
    return(
        <div className="board-big">
            <div className="join-box">
                <Button size="large" variant="contained" onClick={createGame}>Create Game</Button>
                <br></br>
                <br></br>
                <br></br>
                <Button size="large" variant="outlined" onClick={joinGame}>Join Game</Button>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={handleTextInputChange}/>
            </div>
        </div>
    )
}

export default CreateGame;