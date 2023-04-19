import { useLocation } from "react-router-dom";
import GameEndBox from "../../components/Box/GameEndBox/GameEndBox";
import "./EndGame.css"
import Results from "../../types/Results";

const EndGame = () => {
    const { state } = useLocation();
    const data:Results = state;
    
    return(
        <div className="end-game">
            <GameEndBox someoneQuit={data.someoneQuit} newRating={data.newRating} eloChange={data.eloChange} iWon={data.iWon} winner={data.winner} loser={data.loser} tookTooLong={data.tookTooLong} isDraw={data.isDraw} myOpponent={data.myOpponent} />
        </div>
    )
}

export default EndGame;