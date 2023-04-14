import { Button, ButtonProps, styled} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    marginTop: "1.7rem",
    background: "transparent",
    borderWidth: "2px",
    fontFamily: "inter",
    fontWeight: "700",
    fontSize: "1.2rem",
    borderColor: "#3588a9",
    color: "deepskyblue",
    '&:hover': {
        // fontFamily: "inter",
        borderWidth: "2px",
        borderColor: "white",
        color: "white",
        background: "transparent",
        // backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    },
    "&.Mui-disabled": {
        borderColor: "#72727282",
        color: "#72727282",
    }
}));


interface props {
    valid: boolean;
    room: string | undefined;
}

const JoinGameButton = (props:props) => {
    const navigate = useNavigate();
    
    const joinGame = () => {
        navigate('/game?room='+props.room)
    }
    
    return(
        <ColorButton color="primary"  size="large" variant="outlined" onClick={joinGame} disabled={!props.valid}>Join Game</ColorButton>
    )
}

export default JoinGameButton;