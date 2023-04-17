import React, { useContext, useEffect } from "react"
import UserData from "../types/UserData";
import AuthContext from "../context/auth-context";
import config from "../config.json";

const useUserData = () => {
    const authCtx = useContext(AuthContext);
    // @ts-ignore
    let token:string = authCtx.token;
    useEffect(()=>{
        (async () =>{
            const response = await fetch(`${config.URL}/api/userdata`, {
                headers:{
                    'Authorization': "Bearer " + authCtx.token
                }
            });
            if (response.status  !== 200){
                return
            }
            const responseJSON = await response.json();
            const userData:UserData = {
                email: responseJSON.userPrincipalName,
                name: responseJSON.displayName,
                rating: responseJSON.rating,
                wins: responseJSON.wins,
                losses: responseJSON.losses,
                draws: responseJSON.draws,
                rank: responseJSON.rank,
            }
            authCtx.login(token, userData);
            //console.log("response json", userData)
        })()
    }, [token])
    return authCtx;
}

export default useUserData