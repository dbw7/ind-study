import React from "react";
import { ThemeProvider, Typography, createTheme, responsiveFontSizes } from "@mui/material";
import './About.css';

const About =  () => {
    return(
        <div className="about">
            <ThemeProvider theme={responsiveFontSizes(createTheme())}>
                <Typography fontFamily={"inter"} textAlign="center" sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="2.5rem" variant="h5">
                    This is a real-time Chess playing website I built for my independent study.
                </Typography>
                <Typography fontFamily={"inter"} textAlign="center" sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="2.5rem" variant="h5">
                    The front-end of this website is built using React and TypeScript and the build tool is Vite.
                </Typography>
                <Typography fontFamily={"inter"} textAlign="center" sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="2.5rem" variant="h5">
                    The back-end of this website is built using Golang utilizing the Go-Chi routing package and the Gorilla-Websockets package with data stored in MongoDB.
                </Typography>
                <Typography fontFamily={"inter"} textAlign="center" sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="2.5rem" variant="h5">
                    I use Microsoft authentication for user authentication and I use JSON-Web-Tokens to authenticate requests to the server.
                </Typography>
                <Typography fontFamily={"inter"} textAlign="center" sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="2.5rem" variant="h5">
                    Chess games take place over a single websocket connection for a near seamless playing experience, with the exception of the users internet quality playing a factor.
                </Typography>
            </ThemeProvider>
        </div>
    )
}

export default About;