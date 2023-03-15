import React, { useState } from 'react'
import { connect, sendMsg } from './api'
import './App.css'
import ChatHistory from './components/ChatHistory/ChatHistory'
import Header from './components/Header/Header'

const App = ()  => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  connect((msg:MessageEvent) => {
    console.log("New message", msg)
    setChatHistory(prevState =>{
      return prevState.concat(msg.data)
    })
    console.log(chatHistory)
  })
  const send = () => {
    console.log("Hello")
    sendMsg("Hello");
  }
  
  return (
    <div className="App">
      <Header />
      <ChatHistory chat={chatHistory}></ChatHistory>
      <button onClick={send}>Hit</button>
    </div>
  )
}

export default App
