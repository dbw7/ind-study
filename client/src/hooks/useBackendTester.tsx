import React, { useContext, useEffect } from "react";
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";



const useBackendTester = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    //console.log("verify handler")
    useEffect(() => {
        (async () =>{
            try {
                const response = await fetch('http://localhost:8080/auth/verify', {
                headers:{
                    'Authorization': "Bearer " + authCtx.token
                }
            });
            //console.log("response", response.status)
            if (response.status  === 401){
                authCtx.logout();
                navigate("/login?message=relogin");
            } else if (response.status  !== 200){
                authCtx.logout();
                navigate("/login?message=error");
            }
            } catch (error) {
                authCtx.logout();
                navigate("/login?message=error");
            }
        })()
    });
}

export default useBackendTester;