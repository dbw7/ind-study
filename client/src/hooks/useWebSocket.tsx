import { useState, useEffect, useRef } from "react";

const useWebSocket = (
  url: string,
  onMessage: (msg: MessageEvent) => void,
  onOpen?: () => void,
  onClose?: (event: CloseEvent) => void,
  onError?: (error: Event) => void
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messageHandler = useRef(onMessage);

  useEffect(() => {
    messageHandler.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Successfully Connected");
      if (onOpen) onOpen();
    };

    ws.onmessage = (msg) => {
      messageHandler.current(msg);
    };

    ws.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
      if (onClose) onClose(event);
    };

    ws.onerror = (error) => {
      console.log("Socket Error: ", error);
      if (onError) onError(error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url, onOpen, onClose, onError]);

  const sendMsg = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(data);
    } else {
      console.log("Socket is not connected");
    }
  };

  return { socket, sendMsg };
};

export default useWebSocket;