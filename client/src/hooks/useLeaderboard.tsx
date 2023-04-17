import {useEffect, useContext, useState} from 'react';
import AuthContext from '../context/auth-context';
import UserData from '../types/UserData';

const useLeaderBoard = () => {
    const authCtx = useContext(AuthContext);
    const [userDataArrState, setUserDataArrState] = useState<UserData[]>([]);
    let userDataArr:UserData[] = [];
    
    useEffect(()=>{
        userDataArr = [];
        (async ()=>{
            const response = await fetch('http://localhost:8080/api/leaderboard', {
                headers:{
                    'Authorization': "Bearer " + authCtx.token
                }
            });
            if (response.status  === 401){
                authCtx.logout();
                return
            }
            //let firstTime = tokenParams.get("firsttime"); If I wanna do something with first time
            const responseJSON = await response.json();
            
            for (let i = 0; i < responseJSON.length; i++) {
                const userData:UserData = {
                    email: "",
                    name: responseJSON[i].displayName,
                    rating: responseJSON[i].rating,
                    wins: responseJSON[i].wins,
                    losses: responseJSON[i].losses,
                    draws: responseJSON[i].draws,
                    rank: responseJSON[i].rank,
                }
                userDataArr.push(userData);
            }
            setUserDataArrState(userDataArr);
        })()
    }, [])
    return userDataArrState;
}

export default useLeaderBoard;