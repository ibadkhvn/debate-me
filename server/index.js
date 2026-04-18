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

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a debate opponent. The topic is: "${topic}". The user is ${stance} this topic. You must argue the opposite side. Be assertive, use real examples, keep responses short, and end with a challenging question.`
      },
      ...messages
    ]
  })

  res.json({ reply: response.choices[0].message.content })
})

app.listen(3000, () => console.log("Server running on port 3000"))