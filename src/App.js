import "./styles.css";

import React, { useState, useRef, useEffect } from "react";

// Helper function to format timestamp nicely
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function BeautifulChat() {
  const [logoSrc, setLogoSrc] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Each { sender, message, timestamp }
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "https://f5371912bbd2.ngrok-free.app"; // REPLACE with your backend URL
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async function sendQuestion() {
    if (!question.trim()) return;
    setLoading(true);
    const timestamp = new Date();

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: question, timestamp },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      const answer = data.answer || "No response";
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: answer, timestamp: new Date() },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: "Error contacting server.", timestamp: new Date() },
      ]);
    }

    setQuestion("");
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendQuestion();
  }

  return (
    <div style={styles.container}>
      {/* Logo Upload */}
      <div style={styles.logoUploadContainer}>
        <label
          htmlFor="logo-upload"
          style={styles.logoUploadLabel}
          title="Upload Company Logo"
        >
          Upload Logo
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Header with Logo */}
      <header style={styles.header}>
        {logoSrc ? (
          <img src={logoSrc} alt="Logo" style={styles.logo} />
        ) : (
          <div style={styles.logoPlaceholder}>Logo</div>
        )}
        <h2 style={styles.headerTitle}>Company Chatbot</h2>
      </header>

      {/* Chat Window */}
      <section style={styles.chatWindow}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.chatMessage,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === "user" ? "#4B9CE2" : "#F1F0F0",
              color: msg.sender === "user" ? "#fff" : "#000",
              borderTopRightRadius: msg.sender === "user" ? 0 : 20,
              borderTopLeftRadius: msg.sender === "user" ? 20 : 0,
            }}
          >
            <div style={styles.messageText}>{msg.message}</div>
            <div style={styles.messageTime}>
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      {/* Input Area */}
      <footer style={styles.footer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={styles.input}
        />
        <button
          onClick={sendQuestion}
          disabled={loading || !question.trim()}
          style={{
            ...styles.sendButton,
            backgroundColor: loading ? "#87b4e9" : "#4B9CE2",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 480,
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    borderRadius: 8,
    border: "1px solid #ddd",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoUploadContainer: {
    padding: 12,
    borderBottom: "1px solid #ddd",
    textAlign: "right",
    backgroundColor: "#fafafa",
  },
  logoUploadLabel: {
    color: "#4B9CE2",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#f7f7f7",
    borderBottom: "1px solid #ddd",
  },
  logo: {
    height: 48,
    width: 48,
    objectFit: "contain",
    borderRadius: 6,
  },
  logoPlaceholder: {
    height: 48,
    width: 48,
    borderRadius: 6,
    backgroundColor: "#ccc",
    color: "#555",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 22,
    color: "#333",
  },
  chatWindow: {
    flexGrow: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    backgroundColor: "#fff",
  },
  chatMessage: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: 20,
    fontSize: 16,
    position: "relative",
    wordBreak: "break-word",
  },
  messageText: {
    marginBottom: 6,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.6,
    textAlign: "right",
  },
  footer: {
    display: "flex",
    padding: "12px 16px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#f7f7f7",
  },
  input: {
    flexGrow: 1,
    fontSize: 16,
    padding: "10px 14px",
    borderRadius: 20,
    border: "1px solid #bbb",
    outline: "none",
  },
  sendButton: {
    marginLeft: 12,
    padding: "10px 22px",
    borderRadius: 20,
    border: "none",
    color: "#fff",
    fontSize: 16,
    userSelect: "none",
    transition: "background-color 0.3s",
  },
};
