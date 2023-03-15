import React, { ReactNode } from "react";
import "./ChatHistory.css";

type ChatHistoryProps = {
    chat: Array<string>;
    children?: ReactNode;
}

const ChatHistory = ({chat, children}: ChatHistoryProps) => {
    
    return (
        <div className="ChatHistory">
            <h2>Chat History</h2>
            {chat.map((message, index) => 
                <p key={index}>{message}</p>
            )}
        </div>
    )
    
}

export default ChatHistory;