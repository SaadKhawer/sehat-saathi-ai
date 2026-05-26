import { useState } from "react";
import { aiAPI } from "../api/axios";
import { useLang } from "../context/LanguageContext";

export default function MentalHealthPage() {
  const { lang } = useLang();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "السلام علیکم، میں آپ کی بات سننے کے لئے حاضر ہوں۔\n──────\nI am here to listen to you. How are you feeling today?",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user", content: value }];
    setMessages(next);
    setText("");
    setLoading(true);

    try {
      const payload = next.map((m) => ({ role: m.role, content: m.content }));
      const res = await aiAPI.mentalHealth(payload);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data?.data || "..." }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "معذرت، اس وقت جواب نہیں آ سکا۔ دوبارہ کوشش کریں۔",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: "linear-gradient(135deg, #5f3dc4, #7950f2)" }}>
        <h2>🧠 {lang === "ur" ? "ذہنی صحت گفتگو" : "Mental Health Chat"}</h2>
        <p>{lang === "ur" ? "اپنے احساسات شیئر کریں" : "Share your feelings safely"}</p>
      </div>

      <div className="card">
        <div className="chat-area" style={{ minHeight: 340 }}>
          {messages.map((message, index) => (
            <div className={`msg ${message.role === "user" ? "user" : ""}`} key={index}>
              <div className={`msg-avatar ${message.role === "user" ? "user" : "ai"}`}>
                {message.role === "user" ? "👤" : "🌿"}
              </div>
              <div
                className={`bubble ${message.role === "user" ? "user" : "ai"}`}
                dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br>") }}
              />
            </div>
          ))}
          {loading && <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Typing...</p>}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <textarea
            className="input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={lang === "ur" ? "اپنی بات لکھیں..." : "Type your feelings..."}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
