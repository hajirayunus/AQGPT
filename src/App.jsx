import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Bot, ChevronDown, Menu, MessageSquarePlus, Moon, PanelLeftClose, Plus, Sparkles, Sun, Trash2 } from "lucide-react";

const starterPrompts = [
  { icon: "✦", title: "Write something", detail: "Draft an email, story, or post" },
  { icon: "⌘", title: "Help me learn", detail: "Explain a tricky topic simply" },
  { icon: "⌁", title: "Explore an idea", detail: "Brainstorm and think creatively" },
  { icon: "⌘", title: "Help me code", detail: "Build, debug, or understand code" }
];

function App() {
  const [chats, setChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aqgpt-chats") || "[]"); } catch { return []; }
  });
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const activeChat = chats.find(c => c.id === activeId);
  const messages = activeChat?.messages || [];

  useEffect(() => { localStorage.setItem("aqgpt-chats", JSON.stringify(chats)); }, [chats]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [input]);

  function newChat() {
    setActiveId(null);
    setInput("");
    setError("");
    textareaRef.current?.focus();
  }
  function removeChat(id, event) {
    event.stopPropagation();
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  }
  async function send(text = input) {
    const content = text.trim();
    if (!content || busy) return;
    const id = activeId || crypto.randomUUID();
    const prior = chats.find(c => c.id === id)?.messages || [];
    const nextMessages = [...prior, { role: "user", content }];
    const title = chats.find(c => c.id === id)?.title || content.slice(0, 42);
    setChats(prev => {
      const found = prev.some(c => c.id === id);
      const updated = { id, title, messages: nextMessages, updatedAt: Date.now() };
      return found ? prev.map(c => c.id === id ? updated : c) : [updated, ...prev];
    });
    setActiveId(id);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setChats(prev => prev.map(c => c.id === id
        ? { ...c, messages: [...nextMessages, { role: "assistant", content: data.reply }], updatedAt: Date.now() }
        : c));
    } catch (err) {
      setError(err.message || "Couldn't connect. Please try again.");
    } finally {
      setBusy(false);
      textareaRef.current?.focus();
    }
  }
  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {sidebarOpen && <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <span className="brand-name">AQGPT</span>
          <button className="icon-btn sidebar-toggle" title="Close sidebar" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={18} /></button>
        </div>
        <button className="new-chat" onClick={newChat}><MessageSquarePlus size={17} /> <span>New chat</span><span className="shortcut">⌘ K</span></button>
        <div className="history-label">YOUR CHATS</div>
        <div className="history-list">
          {chats.map(chat => <button key={chat.id} className={`history-item ${activeId === chat.id ? "selected" : ""}`} onClick={() => { setActiveId(chat.id); setError(""); }}>
            <span className="history-title">{chat.title}</span>
            <span className="delete-chat" role="button" title="Delete chat" onClick={e => removeChat(chat.id, e)}><Trash2 size={14} /></span>
          </button>)}
          {chats.length === 0 && <p className="empty-history">Your conversations will appear here.</p>}
        </div>
        <div className="sidebar-bottom">
          <div className="profile"><div className="avatar">A</div><div><div className="profile-name">AQGPT</div><div className="profile-caption">Personal AI assistant</div></div><span className="online-dot" /></div>
        </div>
      </aside>}
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            {!sidebarOpen && <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Open sidebar"><Menu size={19} /></button>}
            <div className="mobile-brand"><span className="brand-mark small"><Sparkles size={14} /></span> AQGPT</div>
            <button className="model-pill">AQGPT <ChevronDown size={14} /></button>
          </div>
          <div className="top-actions">
            <span className="status-label"><span className="status-dot" /> AI assistant</span>
            <button className="icon-btn" title={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>
        <section className={`conversation ${messages.length ? "has-messages" : ""}`}>
          {messages.length === 0 ? <div className="welcome">
            <div className="welcome-orb"><div className="orb-core"><Sparkles size={30} /></div><span className="orb-ring ring-one" /><span className="orb-ring ring-two" /></div>
            <div className="eyebrow"><span /> YOUR AI, YOUR IDEAS</div>
            <h1>What can I help<br /><span>you with today?</span></h1>
            <p className="welcome-subtitle">Ask anything. Explore everything. Let's make something great.</p>
            <div className="suggestions">
              {starterPrompts.map((p, i) => <button key={i} className="suggestion" onClick={() => send(p.title + ": " + p.detail)}>
                <span className="suggestion-icon">{p.icon}</span><span><strong>{p.title}</strong><small>{p.detail}</small></span><ArrowUp size={15} className="suggestion-arrow" />
              </button>)}
            </div>
          </div> : <div className="message-list">
            {messages.map((m, i) => <div key={i} className={`message-row ${m.role}`}>
              {m.role === "assistant" && <div className="message-avatar"><Sparkles size={15} /></div>}
              <div className="message-content"><div className="message-role">{m.role === "user" ? "You" : "AQGPT"}</div><div className="message-text">{m.content}</div></div>
              {m.role === "user" && <div className="user-avatar">Y</div>}
            </div>)}
            {busy && <div className="message-row assistant"><div className="message-avatar"><Sparkles size={15} /></div><div className="message-content"><div className="message-role">AQGPT</div><div className="typing"><i /><i /><i /></div></div></div>}
            <div ref={endRef} />
          </div>}
        </section>
        <div className="composer-wrap">
          {error && <div className="error-message">{error}</div>}
          <div className="composer">
            <textarea ref={textareaRef} rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Message AQGPT..." aria-label="Message AQGPT" />
            <div className="composer-bottom"><span className="composer-hint"> <span className="sparkle-mini">✦</span> AQGPT can make mistakes. Check important info.</span><button className={`send-btn ${input.trim() ? "ready" : ""}`} disabled={!input.trim() || busy} onClick={() => send()} title="Send message">{busy ? <span className="spinner" /> : <ArrowUp size={18} />}</button></div>
          </div>
          <div className="footer-note">Powered by AI · Made with <span>✦</span> by AQGPT</div>
        </div>
      </main>
    </div>
  );
}

export default App;