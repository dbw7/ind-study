import React, { BaseSyntheticEvent, useState } from "react";
import './CreateBox.css';
import { useNavigate } from "react-router-dom";
import { Button, ButtonProps, ThemeProvider, Typography, styled, TextField, createTheme, responsiveFontSizes} from "@mui/material";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    marginTop: "1.7rem",
    background: "transparent",
    borderWidth: "2px",
    fontFamily: "inter",
    fontWeight: "700",
    fontSize: "1.2rem",
    borderColor: "#3588a9",
    color: "deepskyblue",
    '&:hover': {
        // fontFamily: "inter",
        borderWidth: "2px",
        borderColor: "white",
        color: "white",
        background: "transparent",
        // backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    },
    "&.Mui-disabled": {
        borderColor: "#72727282",
        color: "#72727282",
    }
}));

const ColorButton2 = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    marginTop: "1rem",
    background: "transparent",
    borderWidth: "2px",
    fontFamily: "inter",
    fontWeight: "700",
    fontSize: "1.2rem",
    borderColor: "#978bf9",
    color: "#978bf9",
    '&:hover': {
        // fontFamily: "inter",
        borderWidth: "2px",
        borderColor: "white",
        color: "white",
        background: "transparent",
        // backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    }
}));


let themex = createTheme();
themex = responsiveFontSizes(themex);

const CreateBox = () => {
    const [room, setRoom] = useState();
    const [error, setError] = useState<boolean>(false);
    const [valid, setValid] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const createGame = () => {
        navigate('/game?room=initial')
    }
    
    const joinGame = () => {
        navigate('/game?room='+room)
    }
    
    const handleTextInputChange = (event:BaseSyntheticEvent) => {
        //console.log(event.target.value.length);
        if(event.target.value.length === 3){
            setStarted(true);
        }
        if(event.target.value.length != 3 && started){
            setError(true);
        } else {
            setError(false);
            setRoom(event.target.value);
        }
        if(event.target.value.length == 3){
            setValid(true);
        } else {
            setValid(false);
        }
    };
    
    return( 
        <>
            <div className="create-box">
                <ColorButton2 size="large" variant="outlined" onClick={createGame}>Create Game</ColorButton2>
                <br></br>
                <br></br>
                <br></br>
                <div className="code-box">
                    <ThemeProvider theme={themex}>
                        <Typography margin="auto" fontFamily={"inter"} fontWeight="700" variant="h5">Enter Room Code:</Typography>
                    </ThemeProvider>
                    <input name="code" className={!error ? "input-box inp" : "input-box-error inp"} onChange={handleTextInputChange} />
                </div>
                <ColorButton color="primary"  size="large" variant="outlined" onClick={joinGame} disabled={!valid}>Join Game</ColorButton>
            </div>
        </>
    )
    
}

export default CreateBox;