import React from "react";
import './GameEndBox.css';
import { Typography } from "@mui/material";
import CreateGameButton from "../BoxButtons/CreateGameButton";
import Results from "../../../types/Results";
import trophy from "../../../images/trophy.png"

const GameEndBox = (props:Results) => {
    return( 
        <>
            {!props.isDraw ? 
            <div className={props.iWon ? "end-game-box-win" : "end-game-box-lose"}>
            <div style={{textAlign:"center"}}>
                {props.iWon && <img className="trophy" src={trophy}></img>}
                <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h4">
                    {!props.tookTooLong ? 
                        props.iWon ? `You defeated ${props.loser}!` : `You lost to ${props.winner}!`
                    :
                        props.iWon ? `${props.loser} took too long to make a move, you win by default!` : `You took too long to make a move, you lost to ${props.winner} by default!`
                    }
                </Typography>
                <br></br>
                <div className="code">
                    <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h5" >{props.iWon ? `Elo Gained: ${props.eloChange}` : `Elo Lost: ${props.eloChange}`}</Typography>
                    <br></br>
                    <Typography  color={props.iWon ? "#ced8c7" : "#a1579e"} fontFamily={"inter"} fontWeight="700" variant="h5" >New Rating: {props.newRating}</Typography>
                </div>
                <br></br>
                <CreateGameButton version={2} text="New Game" />
            </div>
        </div> 
        : 
        <div className="end-game-box-draw">
            <div style={{textAlign:"center"}}>
                <Typography  color="white" fontFamily={"inter"} fontWeight="700" variant="h5" >{`Your match versus ${props.myOpponent} has ended in a draw!`}</Typography>
                <br></br>
                <Typography  color="white" fontFamily={"inter"} fontWeight="700" variant="h5" >{`You have not gained or lost any Elo!`}</Typography>
                <CreateGameButton version={2} text="New Game" />
            </div>
        </div>
            }
        </>
    )
    
}

export default GameEndBox;