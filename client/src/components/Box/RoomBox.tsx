import React from "react";
import { Typography } from "@mui/material";
import './Boxes.css';

interface props {
    roomID: string;
}


const RoomBox = (props:props) => {
    return( 
        <>
            <div className="room-box">
                <div style={{textAlign:"center"}}>
                    <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >Room Code:</Typography>
                     <div className="code">
                        <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >{props.roomID}</Typography>
                    </div>
                    <br></br>
                    <br></br>
                    <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h4" >Waiting for player to join...</Typography>
                </div>
            </div>
        </>
    )
    
}

export default RoomBox;