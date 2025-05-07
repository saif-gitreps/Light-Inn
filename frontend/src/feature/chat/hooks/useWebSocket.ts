import { useCallback, useEffect, useRef, useState } from "react";

type ReadyState =
   | "CONNECTING" // 0
   | "OPEN" // 1
   | "CLOSING" // 2
   | "CLOSED"; // 3

interface UseWebSocketOptions {
   reconnectAttempts?: number;
   reconnectInterval?: number;
   onOpen?: (event: WebSocketEventMap["open"]) => void;
   onClose?: (event: WebSocketEventMap["close"]) => void;
   onMessage?: (event: WebSocketEventMap["message"]) => void;
   onError?: (event: WebSocketEventMap["error"]) => void;
}

const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
   const {
      reconnectAttempts = 3,
      reconnectInterval = 5000,
      onOpen,
      onClose,
      onMessage,
      onError,
   } = options;

   const [readyState, setReadyState] = useState<ReadyState>("CONNECTING");
   const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

   const socketRef = useRef<WebSocket | null>(null);
   const reconnectAttemptsRef = useRef(0);
   const reconnectTimeoutRef = useRef<number | null>(null);

   const connect = useCallback(() => {
      // Close existing socket if any
      if (socketRef.current) {
         socketRef.current.close();
      }

      try {
         const ws = new WebSocket(url);

         ws.onopen = (event) => {
            console.log("WebSocket connection established");
            setReadyState("OPEN");
            reconnectAttemptsRef.current = 0;
            onOpen?.(event);
         };

         ws.onmessage = (event) => {
            setLastMessage(event);
            onMessage?.(event);
         };

         ws.onclose = (event) => {
            console.log("WebSocket connection closed");
            setReadyState("CLOSED");
            onClose?.(event);

            // Try to reconnect if not closed cleanly and we have attempts left
            if (!event.wasClean && reconnectAttemptsRef.current < reconnectAttempts) {
               reconnectAttemptsRef.current += 1;

               console.log(
                  `Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnectAttempts})`
               );

               // Set timeout for reconnection
               reconnectTimeoutRef.current = window.setTimeout(() => {
                  connect();
               }, reconnectInterval);
            }
         };

         ws.onerror = (event) => {
            console.error("WebSocket error:", event);
            onError?.(event);
         };

         socketRef.current = ws;
      } catch (error) {
         console.error("WebSocket connection error:", error);
         setReadyState("CLOSED");
      }
   }, [url, reconnectAttempts, reconnectInterval, onOpen, onClose, onMessage, onError]);

   const sendMessage = useCallback(
      (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
         if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(data);
            return true;
         }
         return false;
      },
      []
   );

   const closeConnection = useCallback(() => {
      if (socketRef.current) {
         socketRef.current.close();
         setReadyState("CLOSED");
      }

      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current !== null) {
         clearTimeout(reconnectTimeoutRef.current);
         reconnectTimeoutRef.current = null;
      }
   }, []);

   // Connect on mount, disconnect on unmount
   useEffect(() => {
      connect();

      return () => {
         closeConnection();
      };
   }, [connect, closeConnection]);

   return {
      sendMessage,
      lastMessage,
      readyState,
      getWebSocket: () => socketRef.current,
   };
};

export default useWebSocket;
