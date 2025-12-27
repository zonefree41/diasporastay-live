import { useEffect, useState } from "react";
import api from "../axios";

export default function BookingChat({ bookingId, role, senderId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        loadMessages();
    }, [bookingId]);

    const loadMessages = async () => {
        const { data } = await api.get(`/api/messages/${bookingId}`);
        setMessages(data);
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        const { data } = await api.post(`/api/messages/${bookingId}`, {
            text,
            senderRole: role,
            senderId,
        });

        setMessages([...messages, data]);
        setText("");
    };

    return (
        <div style={chatWrap}>
            <h3 style={{ marginBottom: 10 }}>💬 Message</h3>

            <div style={chatBox}>
                {messages.map((m) => (
                    <div
                        key={m._id}
                        style={{
                            ...bubble,
                            alignSelf: m.senderRole === role ? "flex-end" : "flex-start",
                            background:
                                m.senderRole === role ? "#2563eb" : "#e5e7eb",
                            color: m.senderRole === role ? "#fff" : "#111",
                        }}
                    >
                        {m.text}
                    </div>
                ))}
            </div>

            <div style={inputRow}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    style={input}
                />
                <button onClick={sendMessage} style={sendBtn}>
                    Send
                </button>
            </div>
        </div>
    );
}

/* ===== STYLES ===== */

const chatWrap = {
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    background: "#fff",
    border: "1px solid #e5e7eb",
};

const chatBox = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 280,
    overflowY: "auto",
    marginBottom: 10,
};

const bubble = {
    padding: "10px 14px",
    borderRadius: 18,
    maxWidth: "70%",
    fontWeight: 600,
};

const inputRow = {
    display: "flex",
    gap: 10,
};

const input = {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "1px solid #d1d5db",
};

const sendBtn = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 800,
};
