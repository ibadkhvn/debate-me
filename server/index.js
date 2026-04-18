require("dotenv").config()
const express = require("express")
const cors = require("cors")
const Groq = require("groq-sdk")

const app = express()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors())
app.use(express.json())

app.post("/debate", async (req, res) => {
  const { messages, topic, stance } = req.body

  const isEthical = topic.toLowerCase().includes("should") ||
                    topic.toLowerCase().includes("right") ||
                    topic.toLowerCase().includes("moral") ||
                    topic.toLowerCase().includes("ethical") ||
                    topic.toLowerCase().includes("wrong") ||
                    topic.toLowerCase().includes("fair")

  const ethicalNote = isEthical ? "This is an ethical question. Always ground your arguments in ethics, fairness, and human values. However, still argue aggressively for your side — do not be diplomatic or neutral, pick a strong ethical stance and defend it." : ""

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a debate opponent. The topic is: "${topic}". The user is ${stance} this topic. You must argue the opposite side. Be assertive, use real examples, keep responses short, and end with a challenging question. Format your response with bold headers using markdown like **this**. ${ethicalNote}`
      },
      ...messages
    ]
  })

  res.json({ reply: response.choices[0].message.content })
})

app.listen(3000, () => console.log("Server running on port 3000"))