import { useContext, useEffect, useRef, useState } from "react";
import config from "../config.json"
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../context/auth-context";
import UserData from "../types/UserData";

const useLogin = () => {
    const [tokenParams] = useSearchParams();
    const [relogin, setRelogin] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useRef(useContext(AuthContext));
    const navigate = useRef(useNavigate());
    const [errorMessage , setErrorMessage] = useState<string>("");
    
    useEffect(() => {
        const failedMessage = tokenParams.get("failed");
        if(failedMessage){
            setError(true);
            let fullMessage = "Error logging in, please refresh the page and try again. Error message from server: " + failedMessage;
            setErrorMessage(fullMessage);
        }
    }, [tokenParams]);
    
    useEffect(() => {
        
        (async () =>{
            let token = tokenParams.get("token");
            console.log(token)
            if(!token){
                return
            }
            const response = await fetch(`${config.URL}/auth/verify`, {
                headers:{
                    'Authorization': "Bearer " + token
                }
            });
            if (response.status  !== 200){
                navigate.current('/login');
                setError(true);
                setIsLoading(false);
                return
            }
            setError(false);
            setErrorMessage("");
            //let firstTime = tokenParams.get("firsttime"); If I wanna do something with first time
            const responseJSON = await response.json();
            const userData:UserData = {
                email: responseJSON.userPrincipalName,
                name: responseJSON.displayName,
                //userId: responseJSON.ID,
                rating: responseJSON.rating,
                wins: responseJSON.wins,
                losses: responseJSON.losses,
                draws: responseJSON.draws,
                rank: responseJSON.rank,
            }
            authCtx.current.login(token, userData);
            console.log("response json", userData)
            navigate.current('/create-game');  
            
        })()
    }, [tokenParams, authCtx]);
    
    return { relogin, error, isLoading, setIsLoading, setError, errorMessage, setErrorMessage}
}


export default useLogin;