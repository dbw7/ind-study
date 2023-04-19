import React, { useContext } from "react";
import './Profile.css'
import { Typography } from "@mui/material";
import useUserData from "../../hooks/useUserData";
import pfp from "../../images/profile.png"

const Profile = () => {
    
    const authCtx = useUserData();
    
    return(
        <div className="profile">
            <div className="profile-inner">
                <img src={pfp} width="100px"/>
                <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">{authCtx.userData.name}</Typography>
                <Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"700"}} marginBottom="1rem" variant="h5">Rank: {authCtx.userData.rank === 999 ? "No Games Played Yet" : authCtx.userData.rank}</Typography> 
                <div className="stats">
                    <div>
                        <Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"700"}} marginBottom="1rem" variant="h5">Rating</Typography>
                        <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">{authCtx.userData.rating}</Typography>
                    </div>
                    <div>
                        <Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"700"}} marginBottom="1rem" variant="h5">Wins</Typography>
                        <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">{authCtx.userData.wins}</Typography>
                    </div>
                    <div>
                        <Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"700"}} marginBottom="1rem" variant="h5">Draws</Typography>
                        <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">{authCtx.userData.draws}</Typography>
                    </div>
                    <div>
                        <Typography fontFamily={"inter"} sx={{color:"white", fontWeight:"700"}} marginBottom="1rem" variant="h5">Losses</Typography>
                        <Typography fontFamily={"inter"} sx={{color:"hsl(246,  6%, 55%)"}} marginBottom="1rem" variant="h5">{authCtx.userData.losses}</Typography>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Profile;