import React from "react";
import './Profile.css'
import { Typography } from "@mui/material";
const Profile = () => {
    
    return(
        <div className="profile">
            <div className="profile-inner">
                <img src="https://cdn-icons-png.flaticon.com/512/5125/5125316.png" width="100px"/>
                <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">First Name</Typography>
                <div className="stats">
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">Rating</Typography>
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">Wins</Typography>
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">Draws</Typography>
                    <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">Losses</Typography>
                </div>
            </div>
        </div>
    )
    
}

export default Profile;