import { Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
//import { Triangle } from "react-loader-spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MicrosoftLoginButton } from "react-social-login-buttons";
import AuthContext from "../../context/auth-context";
import "./Login.css";
import UserData from "../../types/UserData";

const testSite = async (): Promise<Boolean> =>{
    try {
        const response = await fetch('http://localhost:8080/api/test');
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
    const [isLoading, setIsLoading] = useState(false);
    
    const loginHandler = async () =>{
        setIsLoading(true);
        const siteWorking = await testSite()
        if(siteWorking){
            //@ts-ignore
            window.location = ('http://localhost:8080/auth')
        } else {
            setError(true);
            setIsLoading(false);
        }
    }
    const [failedAuth, setFailedAuth] = useState(false);
    const [error, setError] = useState(false);
    
    
    const [tokenParams] = useSearchParams();
    
    const authCtx = useRef(useContext(AuthContext));
    const navigate = useRef(useNavigate());
    
    useEffect(() => {
        if(tokenParams.get("failed")){
            setFailedAuth(true);
        }
    }, [tokenParams]);
    
    useEffect(() => {
        (async () =>{
            let token = tokenParams.get("token");
            if(!token){
                return
            }
            const response = await fetch('http://localhost:8080/auth/verify', {
                headers:{
                    'Authorization': "Bearer " + token
                }
            });
            if (response.status  !== 200){
                navigate.current('/login');
                setError(true);
                setFailedAuth(false);
                setIsLoading(false);
                return
            }
            setError(false);
            //let firstTime = tokenParams.get("firsttime"); If I wanna do something with first time
            const responseJSON = await response.json();
            const userData:UserData = {
                email: responseJSON.userPrincipalName,
                name: responseJSON.displayName,
                userId: responseJSON.ID
            }
            authCtx.current.login(token, userData);
            console.log("response json", userData)
            navigate.current('/create-game');  
            
        })()
    }, [tokenParams, authCtx]);
    
    return(
        <div className="login">
            <div className="login-button">
                {!isLoading ? <MicrosoftLoginButton onClick={loginHandler}></MicrosoftLoginButton> : <></>}
                {failedAuth && <Typography variant="h6" sx={{width:"50vw", textAlign:"center", position:"absolute", right:"25%", color:"#ffcab1",fontFamily: "system-ui", fontWeight: "500",}}>You are not in the @villanova.edu domain and have not been authorized.<br></br><br></br>If this is an error, contact me using the button below.</Typography>}
                {error && <Typography variant="h6" sx={{width:"50vw", textAlign:"center", position:"absolute", right:"25%", color:"#ffcab1",fontFamily: "system-ui", fontWeight: "500",}}>There has been an error, please try again.<br></br><br></br>If this continues, please contact me using the button below.</Typography>}
            </div>
        </div>
    )
}

export default Login;