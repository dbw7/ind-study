import styled from "@emotion/styled";
import { Button, ButtonProps, ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
import { purple } from "@mui/material/colors";
import React, { FC } from "react";
import "./Homepage.css"
import { useNavigate } from "react-router";

let themex = createTheme();
themex = responsiveFontSizes(themex);

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    backgroundImage: "linear-gradient( 83.2deg,  rgba(150,93,233,1) 10.8%, rgba(99,88,238,1) 94.3% )",
    '&:hover': {
        backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    },
}));

const Homepage: FC = () => {
    const navigate = useNavigate();
    return(
        <ThemeProvider theme={themex}>
            <div className="main-box flex-direction">
                <div className="text-button">
                    <Typography fontFamily={"inter"} fontWeight="700" variant="h2" marginBottom="2rem">Chess.</Typography>
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">With an over-engineered interface.</Typography>
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">Built with complicated and powerful systems.</Typography>
                    <ColorButton onClick={()=>{navigate('/login')}} className="button" sx={{width:"200px", borderRadius:"5px"}} variant="contained"><Typography fontFamily={"inter"} fontWeight="700" variant="h6">Play</Typography></ColorButton>
                </div>
                <div className="image-div">
                    <img className="img" src="https://cdn-icons-png.flaticon.com/512/1366/1366540.png"></img>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Homepage;