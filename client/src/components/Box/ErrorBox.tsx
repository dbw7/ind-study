import React from "react";
import './ErrorBox.css';
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

const ErrorBox = () => {
    const navigate = useNavigate();
    const buttonHandler = () => {
        navigate('/create-game')
    }
    
    return( 
        <>
            <div className="error-box">
                <div style={{textAlign:"center"}}>
                    <Typography  color="#ff0000" fontFamily={"inter"} fontWeight="700" variant="h4">Error creating or connecting to game.</Typography>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className="code">
                        <Typography  color="white" fontFamily={"inter"} fontWeight="700" variant="h4" >Try starting a game again? Click here.</Typography>
                    </div>
                    <br></br>
                    <ColorButton variant="outlined" onClick={buttonHandler}  >Create Game</ColorButton>
                </div>
            </div>
        </>
    )
    
}

export default ErrorBox;