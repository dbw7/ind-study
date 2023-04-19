import { Typography } from "@mui/material";
//import { Triangle } from "react-loader-spinner";
import { MicrosoftLoginButton } from "react-social-login-buttons";
import "./Login.css";
import config from "../../config.json";
import useLogin from "../../hooks/useLogin";

const testSite = async (): Promise<Boolean> =>{
    try {
        const response = await fetch(`${config.URL}/api/test`);
        if(response.status === 200){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("error login 12", error)
        return false
    }
}

const Login = () =>{
    
    const {errorMessage, error, isLoading, setIsLoading, setError, setErrorMessage } = useLogin();
    
    const loginHandler = async () =>{
        setIsLoading(true);
        const siteWorking = await testSite()
        if(siteWorking){
            //@ts-ignore
            window.location = (`${config.URL}/auth`)
        } else {
            setError(true);
            setErrorMessage("Trouble connecting to server, please refresh and try again later.")
            setIsLoading(false);
        }
    }
    
    
    
    return(
        <div className="login">
            <div className="login-button">
                {!isLoading ? <MicrosoftLoginButton onClick={loginHandler}></MicrosoftLoginButton> : <></>}
                {error && <Typography variant="h6" sx={{width:"50vw", textAlign:"center", position:"absolute", right:"25%", color:"white",fontFamily: "inter", fontWeight: "500",}}>{errorMessage}</Typography>}
            </div>
        </div>
    )
}

export default Login;