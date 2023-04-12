import React from "react";
import { Button, ButtonProps, ThemeProvider, Typography, styled} from "@mui/material";

interface props {
    buttonText: string;
    buttonFunc: () => void;
}
  
const ColorButtonx = styled(Button)<ButtonProps>(({ theme }) => ({
    //backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )",
    backgroundImage: "linear-gradient( 83.2deg,  rgba(150,93,233,1) 10.8%, rgba(99,88,238,1) 94.3% )",
    '&:hover': {
        backgroundImage: "linear-gradient( 99deg,  rgba(115,18,81,1) 10.6%, rgba(28,28,28,1) 118% )"
    },  
}));

const ColorButton = (props:props) => {
    return (
        <>
            <ColorButtonx onClick={props.buttonFunc}>
                <Typography  color="white" fontFamily={"inter"} fontWeight="700" variant="h6" >{props.buttonText}</Typography>
            </ColorButtonx>
        </>
    )
}

export default ColorButton;