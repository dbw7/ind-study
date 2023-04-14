import { Button, ButtonProps, styled, } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    marginTop: "1rem",
    background: "transparent",
    borderWidth: "2px",
    fontFamily: "inter",
    fontWeight: "700",
    fontSize: "1.2rem",
    borderColor: "#978bf9",
    color: "#978bf9",
    '&:hover': {
        // fontFamily: "inter",
        borderWidth: "2px",
        borderColor: "white",
        color: "white",
        background: "transparent",
        // backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    }
}));

interface props {
    text: string
}

const CreateGameButton = (props: props) => {
    const navigate = useNavigate();
    
    const buttonHandler = () => {
        navigate('/create-game')
    }
    
    return(
        <StyledButton variant="outlined" onClick={buttonHandler} >{props.text}</StyledButton>
    )
}

export default CreateGameButton;