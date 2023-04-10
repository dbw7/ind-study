import CMove from "../types/Move";

const connect = (room: string, player: string) => {
  let socket = new WebSocket(`ws://localhost:8080/ws:${room}:${player}`);
  
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };
  
  socket.onmessage = msg => {
    console.log(JSON.parse(msg.data));
    //cb(msg);
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
  console.log("socket xxxx")
  return socket;
};

const sendMsg = (socket:WebSocket, move: CMove) => {
  try {
    console.log("sending msg: ", move);
    socket.send(JSON.stringify(move));
  } catch (error) {
    console.log("error 33", error)
  }
};


export { connect, sendMsg };