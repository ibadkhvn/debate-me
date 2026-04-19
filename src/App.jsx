import { useState } from "react"
import "./App.css"
import ReactMarkdown from "react-markdown"

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [topic, setTopic] = useState("")
  const [debateStarted, setDebateStarted] = useState(false)
  const [loading, setLoading] = useState(false)

  const suggestedTopics = [
    "Social media does more harm than good",
    "AI will take over most jobs in 10 years",
    "Remote work is better than office work",
    "Pineapple belongs on pizza",
    "Space exploration is a waste of money",
    "Homework should be abolished",
  ]

  const resetDebate = () => {
    setMessages([])
    setTopic("")
    setDebateStarted(false)
  }

  const startDebate = () => {
    if (topic) setDebateStarted(true)
  }

  const sendMessage = async () => {
    if (!input) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const response = await fetch("https://debate-me-production.up.railway.app/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, topic, stance: "for" })
    })

    const data = await response.json()
    setMessages([...newMessages, { role: "assistant", content: data.reply }])
    setLoading(false)
  }

  const getVerdict = async () => {
    setLoading(true)
    const response = await fetch("https://debate-me-production.up.railway.app/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, topic, stance: "for", verdict: true })
    })

    const data = await response.json()
    setMessages([...messages, { role: "verdict", content: data.reply }])
    setLoading(false)
  }

  if (!debateStarted) {
    return (
      <div className="container">
        <h1 onClick={resetDebate} style={{ cursor: "pointer" }}>Debate Me</h1>
        <p className="subtitle">Argue your point. We'll push back.</p>
        <div className="topic-screen">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic to debate..."
            onKeyDown={(e) => e.key === "Enter" && startDebate()}
          />
          <div className="suggestions">
            {suggestedTopics.map((t, i) => (
              <button key={i} className="suggestion-pill" onClick={() => setTopic(t)}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={startDebate}>Begin →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 onClick={resetDebate} style={{ cursor: "pointer" }}>Debate Me</h1>
      <p className="subtitle">Argue your point. We'll push back.</p>
      <div className="debate-screen">
        <div>
          <p className="topic-label">Topic</p>
          <p className="topic-title">{topic}</p>
        </div>
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === "user" ? "user" : msg.role === "verdict" ? "verdict" : "ai"}`}>
              <span className="message-role">
                {msg.role === "user" ? "You" : msg.role === "verdict" ? "Verdict" : "AI"}
              </span>
              <div className="message-content">
                {msg.content && <ReactMarkdown>{msg.content}</ReactMarkdown>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <span className="message-role">AI</span>
              <div className="message-content thinking">Thinking...</div>
            </div>
          )}
        </div>
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Make your argument..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={getVerdict}>Verdict ⚖</button>
          <button onClick={sendMessage}>Send →</button>
        </div>
      </div>
    </div>
  )
}

export default App