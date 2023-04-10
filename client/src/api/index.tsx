import CMove from "../types/Move";

const connect = (socket:WebSocket) => {
  
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };
  
  

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
  console.log("socket xxxx")
  //return socket;
};

const sendMsgx = (socket:WebSocket, move: CMove) => {
  console.log("sending")
  try {
    socket.send(JSON.stringify(move));
  } catch (error) {
    console.log("socket err 31", error)
  }
 
};


export { connect, sendMsgx };