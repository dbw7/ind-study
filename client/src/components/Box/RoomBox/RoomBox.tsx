import { Typography } from "@mui/material";
import './RoomBox.css';
import CreateGameButton from "../BoxButtons/CreateGameButton";

interface props {
    roomID: string;
    noJoin: boolean;
}


const RoomBox = (props:props) => {
    return( 
        <>
            <div className="room-box">
                <div style={{textAlign:"center"}}>
                    {!props.noJoin &&
                    <>
                        <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >Room Code:</Typography>
                        <div className="code">
                            <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h2" >{props.roomID}</Typography>
                        </div>
                        <br></br>
                        <br></br>
                    </>
                    }
                    {props.noJoin ? 
                    <Typography  color="#ffdc19" fontFamily={"inter"} fontWeight="700" variant="h4" >Player took too long to join.</Typography> 
                    : 
                    <Typography  color="#6b5ba8" fontFamily={"inter"} fontWeight="700" variant="h4" >Waiting for player to join...</Typography>}
                    {props.noJoin && <CreateGameButton version={1} text="Create New Game" />}
                </div>
            </div>
        </>
    )
    
}

export default RoomBox;