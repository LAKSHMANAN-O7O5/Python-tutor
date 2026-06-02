import { useState, useRef, useEffect } from "react";

const TOPICS = [
  { id: "variables", label: "Variables & Data Types", icon: "📦" },
  { id: "strings", label: "Strings", icon: "🔤" },
  { id: "lists", label: "Lists & Tuples", icon: "📋" },
  { id: "dicts", label: "Dictionaries", icon: "🗂️" },
  { id: "conditions", label: "If / Else", icon: "🔀" },
  { id: "loops", label: "Loops", icon: "🔁" },
  { id: "functions", label: "Functions", icon: "⚙️" },
  { id: "classes", label: "OOP & Classes", icon: "🏗️" },
];

const SYSTEM_PROMPT = `You are PyBro — a fun, friendly Python tutor who teaches like a knowledgeable friend. 
Keep explanations short, clear, and beginner-friendly.
Always include a simple code example wrapped in triple backticks with python language tag.
Use simple analogies. Be encouraging. Max 4-5 sentences of explanation + 1 code block.
At the end, always add one quiz question like: "🧠 Quick check: [simple question about the topic]"`;

const TOPIC_PROMPTS = {
  variables: "Explain Python variables and data types (int, float, str, bool) with simple examples.",
  strings: "Explain Python strings — creation, indexing, slicing, and common methods like upper(), lower(), split(), replace().",
  lists: "Explain Python lists and tuples — creation, indexing, append, remove, slicing, and the difference between mutable lists and immutable tuples.",
  dicts: "Explain Python dictionaries — key-value pairs, creating, accessing, updating, and looping through them.",
  conditions: "Explain Python if/elif/else conditions with simple real-world examples.",
  loops: "Explain Python for loops and while loops with clear examples including range() usage.",
  functions: "Explain Python functions — def keyword, parameters, return values, and default arguments with simple examples.",
  classes: "Explain Python OOP basics — classes, __init__, self, attributes, and methods with a simple real-world example.",
};

const STORAGE_KEY = "pybro-history-v1";
const MIN_REQUEST_GAP = 3000; // ms between API calls to avoid rate limits
let lastRequestTime = 0;

function parseContent(text) {
  const parts = [];
  const codeRegex = /```(?:python)?\n?([\s\S]*?)```/g;
  let last = 0, match;
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", content: match[1].trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: "relative", margin: "12px 0", borderRadius: 10, overflow: "hidden", background: "#0d1117", border: "1px solid #30363d" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        <span style={{ color: "#8b949e", fontSize: 12, fontFamily: "monospace" }}>python</span>
        <button onClick={copy} style={{ background: "none", border: "none", color: copied ? "#3fb950" : "#8b949e", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", overflowX: "auto", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13.5, lineHeight: 1.7, color: "#e6edf3" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Message({ role, parts }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexDirection: role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: role === "user" ? "linear-gradient(135deg, #f7971e, #ffd200)" : "linear-gradient(135deg, #3a7bd5, #00d2ff)",
        fontSize: 16, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
      }}>
        {role === "user" ? "S" : "🐍"}
      </div>
      <div style={{ maxWidth: "82%", background: role === "user" ? "linear-gradient(135deg, #f7971e22, #ffd20022)" : "#161b22", border: role === "user" ? "1px solid #f7971e44" : "1px solid #30363d", borderRadius: role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "12px 16px" }}>
        {parts.map((p, i) =>
          p.type === "code"
            ? <CodeBlock key={i} code={p.content} />
            : <p key={i} style={{ margin: 0, color: "#c9d1d9", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{p.content}</p>
        )}
      </div>
    </div>
  );
}

export default function PythonTutor() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");
  const [storageReady, setStorageReady] = useState(false);
  const bottomRef = useRef(null);

  // Load from persistent storage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result?.value) setAllMessages(JSON.parse(result.value));
      } catch (e) {}
      setStorageReady(true);
    };
    load();
  }, []);

  // Save to persistent storage whenever messages change
  useEffect(() => {
    if (!storageReady || Object.keys(allMessages).length === 0) return;
    const save = async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(allMessages)); } catch (e) {}
    };
    save();
  }, [allMessages, storageReady]);

  const messages = selectedTopic ? (allMessages[selectedTopic.id] || []) : [];

  const setMessages = (updater) => {
    if (!selectedTopic) return;
    const id = selectedTopic.id;
    setAllMessages(prev => ({
      ...prev,
      [id]: typeof updater === "function" ? updater(prev[id] || []) : updater
    }));
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const callGemini = async (userMsg, history) => {
    // Throttle: wait if we sent a request too recently
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_REQUEST_GAP) {
      await new Promise(r => setTimeout(r, MIN_REQUEST_GAP - elapsed));
    }
    lastRequestTime = Date.now();

    // Convert history to Gemini format
    const contents = history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    contents.push({ role: "user", parts: [{ text: userMsg }] });

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 1000 }
      }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.error("API Error:", data);
      if (res.status === 429) {
        return "Bro, too many requests right now 🫣 Wait a few seconds and try again — free tier has limits!";
      }
      return `Bro something went wrong: ${data.error?.message || res.statusText}`;
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Bro something went wrong, try again!";
  };

  const startTopic = async (topic) => {
    setSelectedTopic(topic);
    setView("chat");
    if (allMessages[topic.id]?.length > 0) return;
    setLoading(true);
    const welcome = TOPIC_PROMPTS[topic.id];
    const reply = await callGemini(welcome, []);
    setAllMessages(prev => ({
      ...prev,
      [topic.id]: [
        { role: "user", content: welcome, parts: [{ type: "text", content: `📚 Teach me: ${topic.label}` }] },
        { role: "assistant", content: reply, parts: parseContent(reply) },
      ]
    }));
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const newMsgs = [...messages, { role: "user", content: userText, parts: [{ type: "text", content: userText }] }];
    setMessages(newMsgs);
    setLoading(true);
    const reply = await callGemini(userText, history);
    setMessages(prev => [...prev, { role: "assistant", content: reply, parts: parseContent(reply) }]);
    setLoading(false);
  };

  if (!storageReady) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 40 }}>🐍</span>
        <span style={{ color: "#8b949e", fontSize: 14 }}>Loading your progress...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#161b22", borderBottom: "1px solid #30363d", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        {view === "chat" && (
          <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: 20, padding: 0, marginRight: 4 }}>←</button>
        )}
        <span style={{ fontSize: 22 }}>🐍</span>
        <div>
          <div style={{ color: "#e6edf3", fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>PyBro Tutor</div>
          <div style={{ color: "#8b949e", fontSize: 11 }}>{view === "chat" && selectedTopic ? selectedTopic.label : "Python from scratch, bro!"}</div>
        </div>
        {view === "chat" && selectedTopic && (
          <div style={{ marginLeft: "auto", background: "#21262d", border: "1px solid #30363d", borderRadius: 20, padding: "4px 12px", color: "#58a6ff", fontSize: 12 }}>
            {selectedTopic.icon} {selectedTopic.label}
          </div>
        )}
      </div>

      {/* Home */}
      {view === "home" && (
        <div style={{ flex: 1, padding: "28px 20px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🐍</div>
            <h1 style={{ color: "#e6edf3", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Python Marandha? No problem bro!</h1>
            <p style={{ color: "#8b949e", fontSize: 14, margin: 0 }}>Pick a topic and PyBro will teach you step by step with examples and quizzes.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TOPICS.map(topic => (
              <button key={topic.id} onClick={() => startTopic(topic)} style={{
                background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "16px 14px",
                cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 6,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#58a6ff"; e.currentTarget.style.background = "#1c2128"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#30363d"; e.currentTarget.style.background = "#161b22"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{topic.icon}</span>
                  {allMessages[topic.id]?.length > 0 && (
                    <span style={{ fontSize: 10, background: "#3fb95022", color: "#3fb950", border: "1px solid #3fb95044", borderRadius: 8, padding: "2px 6px" }}>resume</span>
                  )}
                </div>
                <span style={{ color: "#e6edf3", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{topic.label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 14, color: "#8b949e", fontSize: 13, textAlign: "center" }}>
            💾 Progress auto-saved — app close பண்ணாலும் history இருக்கும்!
          </div>
        </div>
      )}

      {/* Chat */}
      {view === "chat" && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
            {messages.map((m, i) => <Message key={i} role={m.role} parts={m.parts} />)}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #3a7bd5, #00d2ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🐍</div>
                <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#58a6ff", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #30363d", background: "#161b22", maxWidth: 680, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask anything about this topic... (Enter to send)"
                rows={1}
                style={{
                  flex: 1, background: "#0d1117", border: "1px solid #30363d", borderRadius: 10,
                  color: "#e6edf3", fontSize: 14, padding: "10px 14px", resize: "none", outline: "none",
                  fontFamily: "inherit", lineHeight: 1.5,
                }}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
                background: loading || !input.trim() ? "#21262d" : "linear-gradient(135deg, #3a7bd5, #00d2ff)",
                border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff",
                cursor: loading || !input.trim() ? "default" : "pointer", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap",
              }}>
                Send →
              </button>
            </div>
            <div style={{ color: "#8b949e", fontSize: 11, marginTop: 6, textAlign: "center" }}>
              Ask doubts, request more examples, or answer the quiz!
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        textarea:focus { border-color: #58a6ff !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
      `}</style>
    </div>
  );
}
