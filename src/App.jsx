import { useState } from "react"
import "./App.css"
import ReactMarkdown from "react-markdown"

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [topic, setTopic] = useState("")
  const [debateStarted, setDebateStarted] = useState(false)

  const suggestedTopics = [
    "Social media does more harm than good",
    "AI will take over most jobs in 10 years",
    "Remote work is better than office work",
    "Pineapple belongs on pizza",
    "Space exploration is a waste of money",
    "Homework should be abolished",
  ]

  const startDebate = () => {
    if (topic) setDebateStarted(true)
  }

  const sendMessage = async () => {
    if (!input) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    const response = await fetch("http://localhost:3000/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, topic, stance: "for" })
    })

    const data = await response.json()
    setMessages([...newMessages, { role: "assistant", content: data.reply }])
  }

  if (!debateStarted) {
    return (
      <div className="container">
        <h1>Debate Me</h1>
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
      <h1>Debate Me</h1>
      <p className="subtitle">Argue your point. We'll push back.</p>
      <div className="debate-screen">
        <div>
          <p className="topic-label">Topic</p>
          <p className="topic-title">{topic}</p>
        </div>
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
              <span className="message-role">{msg.role === "user" ? "You" : "AI"}</span>
              <div className="message-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Make your argument..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send →</button>
        </div>
      </div>
    </div>
  )
}

export default App