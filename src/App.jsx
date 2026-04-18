import { useState } from "react"

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [topic, setTopic] = useState("")
  const [debateStarted, setDebateStarted] = useState(false)

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
      <div>
        <h1>Debate Me</h1>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a debate topic..."
        />
        <button onClick={startDebate}>Start Debate</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Topic: {topic}</h1>
      <div>
        {messages.map((msg, i) => (
          <p key={i}><b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your argument..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default App