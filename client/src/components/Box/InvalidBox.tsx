import React from "react";
import './Boxes.css';
import { useNavigate } from "react-router-dom";
import { Button, ButtonProps, ThemeProvider, Typography, styled, TextField, createTheme, responsiveFontSizes} from "@mui/material";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
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
                    <ColorButton variant="outlined" onClick={buttonHandler}  >Create Game</ColorButton>
                </div>
            </div>
        </>
    )
    
}

export default InvalidBox;