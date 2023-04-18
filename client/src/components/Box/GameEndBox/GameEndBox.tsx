import React from "react";
import './GameEndBox.css';
import { Typography } from "@mui/material";
import CreateGameButton from "../BoxButtons/CreateGameButton";
import Results from "../../../types/Results";


const GameEndBox = (props:Results) => {
    
    return( 
        <>
            <div className={props.iWon ? "end-game-box-win" : "end-game-box-lose"}>
                <div style={{textAlign:"center"}}>
                    {props.iWon && <img className="trophy" src="https://cdn-icons-png.flaticon.com/512/1069/1069234.png"></img>}
                    <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h4">
                        {!props.tookTooLong ? 
                            props.iWon ? `You defeated ${props.loser}!` : `You lost to ${props.winner}!`
                        :
                            props.iWon ? `${props.loser} took too long to make a move, you win by default!` : `You took too long to make a move, you lost to ${props.winner} by default!`
                        }
                    </Typography>
                    <br></br>
                    <div className="code">
                        <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h5" >{props.iWon ? "Elo Gained:" : "Elo Lost:"}</Typography>
                        <br></br>
                        <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h5" >New Rating:</Typography>
                    </div>
                    <br></br>
                    <CreateGameButton version={2} text="New Game" />
                </div>
            </div>
        </>
    )
    
}

export default GameEndBox;