# Debate Me

An AI-powered debate app where you argue your point and the AI pushes back. Built with React and Node.js.

🔗 **Live Demo**: https://debate-me-app.vercel.app/

## Features

- Enter any topic and debate the AI in real time
- AI always argues the opposite side of your position
- Suggested topics to get started quickly
- Ethical stance detection — AI grounds arguments in ethics for moral questions
- Verdict system — ask the AI to judge who made stronger arguments
- Loading indicator while AI is thinking
- Click the title to reset and start a new debate

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **AI**: Groq API (llama-3.1-8b-instant)
- **Deployment**: Vercel (frontend), Railway (backend)

## Running Locally

1. Clone the repo
git clone https://github.com/ibadkhvn/debate-me.git

2. Set up the backend
cd server
npm install
   Create a `.env` file in the server folder:
GROQ_API_KEY=your_key_here
   Start the server:
node index.js

3. Set up the frontend
cd ..
npm install
npm run dev

4. Open `http://localhost:5173` in your browser

## Getting a Groq API Key

Sign up for free at [console.groq.com](https://console.groq.com) to get your API key.
