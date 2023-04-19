import Countdown from "react-countdown";

const ChessCountdown = () => {
    
    const Completionist = () => <span>You are good to go!</span>;
    // @ts-ignore
    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            // console.log("completed")
            // return <Completionist />;
        } else {
            return <span>{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</span>;
        }
    };
      
    return(
        <div style={{marginLeft:"2rem"}}>
            <Countdown
                date={Date.now() + 120000}
                renderer={renderer}
            />
        </div>
    )
    
}

export default ChessCountdown;