import React from "react";
import { useState } from "react";

type UserData  = {
    userId: string,
    name: string,
    email: string,
};
export type AuthContextType = {
    token: string | null,
    userData: UserData;
    isLoggedIn: boolean;
    login: (token:string, userData:UserData) => void;
    logout: () => void;
};
type ContextProps = {
    children: React.ReactNode;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

//React.FC<React.ReactNode>
export const AuthContextProvider = (props: ContextProps) => {
    const initialToken = localStorage.getItem('token');
    let initialUserDataString = localStorage.getItem('userData');
    let initalUserDataObject = {} as UserData;
    if(initialUserDataString){
        initalUserDataObject = JSON.parse(initialUserDataString);
    }
    const [token, setToken] = useState(initialToken);
    const [userData, setUserData] = useState(initalUserDataObject);
    const userIsLoggedIn = !!token;
    
    const loginHandler = (token: string, userData:UserData) => {
        setToken(token);
        setUserData(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };
    
    const logoutHandler = () => {
        let nullUserData = {} as UserData;
        setToken(null);
        setUserData(nullUserData);
        localStorage.clear();
    }
    
    const contextValue:AuthContextType = {
        token: token,
        userData: userData,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }
    
    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;