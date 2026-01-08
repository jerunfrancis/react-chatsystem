import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function Chat({ user, to }) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/ws?username=${user}`),
      debug: () => {},

      onConnect: () => {
        setConnected(true);

        client.subscribe("/user/queue/messages", message => {
          setMessages(prev => [...prev, JSON.parse(message.body)]);
        });
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [user]);

  const sendMessage = () => {
    if (!connected || !msg.trim()) return;

    // Sender sees message instantly
    setMessages(prev => [
      ...prev,
      { sender: user, content: msg }
    ]);

    clientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        receiver: to,
        content: msg
      })
    });

    setMsg("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          Chat with <b>{to}</b>
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: m.sender === user ? "flex-end" : "flex-start",
                background:
                  m.sender === user ? "#dcf8c6" : "#ffffff"
              }}
            >
              <div style={styles.sender}>{m.sender}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>

        <div style={styles.inputBar}>
          <input
            style={styles.input}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder={connected ? "Type a message..." : "Connecting..."}
            disabled={!connected}
          />
          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ece5dd",
    fontFamily: "Arial, sans-serif"
  },

  chatBox: {
    width: "400px",
    height: "600px",
    background: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
  },

  header: {
    padding: "15px",
    background: "#075e54",
    color: "white",
    fontSize: "16px"
  },

  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto"
  },

  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
  },

  sender: {
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#555"
  },

  inputBar: {
    display: "flex",
    padding: "10px",
    background: "#f7f7f7"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    marginLeft: "10px",
    padding: "10px 15px",
    borderRadius: "20px",
    border: "none",
    background: "#25d366",
    color: "white",
    cursor: "pointer"
  }
};
