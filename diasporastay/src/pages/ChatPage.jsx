import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";

export default function ChatPage() {
    const { bookingId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem("ownerToken") ? "owner" : "guest";

    useEffect(() => {
        loadMessages();
    }, [bookingId]);

    const loadMessages = async () => {
        try {
            const { data } = await api.get(`/api/messages/${bookingId}`);
            setMessages(data || []);
        } catch {
            alert("Unable to load messages");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        try {
            const { data } = await api.post(`/api/messages/${bookingId}`, {
                text,
            });
            setMessages((prev) => [...prev, data]);
            setText("");
        } catch {
            alert("Message failed");
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading messages…</p>;

    return (
        <div style={page}>
            <h2 style={title}>💬 Messages</h2>

            <div style={chatBox}>
                {messages.map((m) => (
                    <div
                        key={m._id}
                        style={{
                            ...bubble,
                            alignSelf: m.senderRole === role ? "flex-end" : "flex-start",
                            background:
                                m.senderRole === role ? "#2563eb" : "#f3f4f6",
                            color:
                                m.senderRole === role ? "#fff" : "#111827",
                        }}
                    >
                        {m.text}
                        <div style={time}>
                            {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <div style={inputRow}>
                <input
                    style={input}
                    placeholder="Type a message…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button style={sendBtn} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}


const page = {
    maxWidth: 900,
    margin: "30px auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    height: "85vh",
};

const title = { marginBottom: 10, fontWeight: 900 };

const chatBox = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    background: "#fff",
    borderRadius: 18,
    overflowY: "auto",
    boxShadow: "0 10px 24px rgba(0,0,0,.08)",
};

const bubble = {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.4,
};

const time = {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 4,
};

const inputRow = {
    display: "flex",
    gap: 10,
    marginTop: 10,
};

const input = {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "1px solid #d1d5db",
};

const sendBtn = {
    padding: "12px 18px",
    borderRadius: 14,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
};
