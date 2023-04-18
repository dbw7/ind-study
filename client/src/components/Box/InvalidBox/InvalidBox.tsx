import React from "react";
import './InvalidBox.css';
import { Typography } from "@mui/material";
import CreateGameButton from "../BoxButtons/CreateGameButton";

const InvalidBox = () => {
    
    return( 
        <>
            <div className="invalid-box">
                <div style={{textAlign:"center"}}>
                    <Typography  color="#e9b14a" fontFamily={"inter"} fontWeight="700" variant="h4">The room you tried to access is full or doesn't exist.</Typography>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className="code">
                        <Typography  color="#e9b14a" fontFamily={"inter"} fontWeight="700" variant="h4" >Want to start a game? Click here.</Typography>
                    </div>
                    <br></br>
                    <CreateGameButton version={2} text="Create New Game" />
                </div>
            </div>
        </>
    )
    
}

export default InvalidBox;