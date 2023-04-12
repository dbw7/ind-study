import React from "react";
import { Typography } from "@mui/material";
import ColorButton from "../ColorButton/ColorButton";
import './Boxes.css';
import { useNavigate } from "react-router-dom";


const InvalidBox = () => {
    const navigate = useNavigate();
    const buttonHandler = () => {
        navigate('/create-game')
    }
    
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
                    <ColorButton buttonFunc={buttonHandler} buttonText="Create Game" />
                </div>
            </div>
        </>
    )
    
}

export default InvalidBox;