import React, { BaseSyntheticEvent, useState } from "react";
import './CreateBox.css';
import { ThemeProvider, Typography, createTheme, responsiveFontSizes} from "@mui/material";
import CreateGameButton from "../BoxButtons/CreateGameButton";
import JoinGameButton from "../BoxButtons/JoinGameButton";




let themex = createTheme();
themex = responsiveFontSizes(themex);

const CreateBox = () => {
    const [room, setRoom] = useState();
    const [error, setError] = useState<boolean>(false);
    const [valid, setValid] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    
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
                <CreateGameButton text="Create Game"/>
                <br></br>
                <br></br>
                <br></br>
                <div className="code-box">
                    <ThemeProvider theme={themex}>
                        <Typography margin="auto" fontFamily={"inter"} fontWeight="700" variant="h5">Enter Room Code:</Typography>
                    </ThemeProvider>
                    <input name="code" className={!error ? "input-box inp" : "input-box-error inp"} onChange={handleTextInputChange} />
                </div>
                <JoinGameButton room={room} valid={valid} />
            </div>
        </>
    )
    
}

export default CreateBox;