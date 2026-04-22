import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import { getJson } from "../../utils/api";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getMessageId = (message) => {
  if (!message) return null;

  if (message._id || message.id) {
    return message._id || message.id;
  }

  const senderKey =
    typeof message.sender === "string"
      ? message.sender
      : message.sender?._id || message.sender?.id || "unknown";

  return `${senderKey}-${message.createdAt ?? ""}-${message.text ?? ""}`;
};

const getSenderId = (sender) => {
  if (!sender) return "";
  if (typeof sender === "string") return sender;
  return sender._id || sender.id || "";
};

const sortByCreatedAt = (items) =>
  [...items].sort(
    (a, b) =>
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime(),
  );

const mergeUniqueMessages = (existing, incoming) => {
  const map = new Map();

  existing.forEach((message) => {
    map.set(getMessageId(message), message);
  });

  incoming.forEach((message) => {
    map.set(getMessageId(message), message);
  });

  return sortByCreatedAt(Array.from(map.values()));
};

const formatTime = (createdAt) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Chat = ({ conversationId, receiverId }) => {
  const { user } = useContext(AuthContext);
  const currentUserId = useMemo(() => user?._id || user?.id || "", [user]);

  const socketRef = useRef(null);
  const activeConversationRef = useRef(conversationId || "");
  const endRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    activeConversationRef.current = conversationId || "";

    const socket = socketRef.current;
    if (socket && socket.connected && conversationId) {
      socket.emit("joinRoom", conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      setError("");
      return;
    }

    let active = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getJson(`/api/messages/${encodeURIComponent(conversationId)}`);
        if (!active) return;

        setMessages(sortByCreatedAt(Array.isArray(data) ? data : []));
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError?.message || "Failed to load messages");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      active = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    const handleConnect = () => {
      const activeConversationId = activeConversationRef.current;
      if (activeConversationId) {
        socket.emit("joinRoom", activeConversationId);
      }
    };

    const handleReceiveMessage = (message) => {
      const activeConversationId = activeConversationRef.current;
      if (!message || message.conversationId !== activeConversationId) return;

      setMessages((previous) => mergeUniqueMessages(previous, [message]));
    };

    const handleMessageError = (socketError) => {
      setError(socketError?.message || "Message failed");
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageError", handleMessageError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageError", handleMessageError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleSend = (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text || !conversationId || !receiverId || !currentUserId) return;

    setError("");

    socketRef.current?.emit("sendMessage", {
      senderId: currentUserId,
      receiverId,
      conversationId,
      text,
    });

    setDraft("");
  };

  return (
    <div className="flex h-[80vh] flex-col rounded-xl border border-brand-border bg-brand-background text-brand-text">
      <div className="border-b border-brand-border p-3">
        <h2 className="font-semibold">Chat</h2>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {isLoading ? <p>Loading...</p> : null}
        {!isLoading && error ? <p className="text-red-500">{error}</p> : null}

        {!isLoading &&
          messages.map((message) => {
            const isMine = getSenderId(message.sender) === currentUserId;

            return (
              <div
                key={getMessageId(message)}
                className={`max-w-[60%] rounded-lg p-2 ${
                  isMine
                    ? "ml-auto bg-brand-messageSent text-right"
                    : "mr-auto bg-brand-messageReceived text-left"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">{formatTime(message.createdAt)}</span>
              </div>
            );
          })}

        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-brand-border p-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded bg-white p-2 text-black"
          autoComplete="off"
        />
        <button type="submit" className="rounded bg-brand-primary px-4 py-2 text-white">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
