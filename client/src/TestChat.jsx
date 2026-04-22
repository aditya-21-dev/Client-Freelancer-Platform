import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function TestChat() {
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return; // prevent double connection

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    const conversationId = "test123";

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      // ✅ join room
      socket.emit("joinRoom", conversationId);
    });

    // ✅ listen for messages
    socket.on("receiveMessage", (msg) => {
      console.log("Received:", msg);
    });

  }, []);

  return <h1>Check console</h1>;
}