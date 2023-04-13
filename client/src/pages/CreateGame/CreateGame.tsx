import styled from "@emotion/styled";
import { Button, TextField, ThemeProvider, Typography } from "@mui/material";
import React, { BaseSyntheticEvent, ChangeEvent, FC, SyntheticEvent, useContext, useState } from "react";
import "./CreateGame.css"
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import AuthContext from "../../context/auth-context";
import { redirect, useNavigate } from "react-router-dom";
import CreateBox from "../../components/Box/CreateBox";


const CreateGame: FC = () => {
    return(
        <div className="board-big">
            <CreateBox></CreateBox>
        </div>
    )
}

export default CreateGame;