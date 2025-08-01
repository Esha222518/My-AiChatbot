# 🤖 My AI Chatbot

A responsive, full-stack AI-powered chatbot built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Google Gemini API**. This project replicates a ChatGPT-style interface and supports real-time conversation with typing indicators and PDF parsing support.

## 🚀 Features

- ✨ Real-time chat interface
- ⏳ Typing indicator while AI is thinking
- 📄 Upload PDF and extract content
- 🤖 Powered by **Google Gemini 2.0 Flash Model**
- 🎨 Responsive design using Tailwind CSS and `shadcn/ui`
- 🔐 API Key stored securely via environment variables

## 🧠 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **AI Backend**: Gemini API (`generativelanguage.googleapis.com`)
- **State Management**: React hooks (`useState`, `useEffect`)
- **PDF Parsing**: `pdfjs-dist`

## 📦 Installation

```bash
git clone https://github.com/yourusername/myaichatbot.git
cd myaichatbot
npm install
🔑 Setup Environment Variable
Create a .env.local file in the root and add your Gemini API Key:
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
Run Locally
npm run dev
Open http://localhost:3000 to view the chatbot in action.
myaichatbot/
│
├── app/
│   ├── page.tsx            # Chat UI
│   ├── layout.tsx
│
├── components/
│   ├── ChatMessage.tsx     # Message UI Component
│   ├── TypingIndicator.tsx # Loader
│
├── public/
│   
│
├── utils/
│   └── pdfParser.ts        # PDF parsing logic
│
├── pages/
│   └── api/
│       └── chat.ts         # Gemini API interaction route


⚙️ How It Works

1. User types a message (or uploads a PDF).
2. The app displays a typing indicator.
3. The message is sent to a backend API route.
4. The server sends a request to the Gemini 2.0 Flash API.
5. AI response is streamed back and rendered in real-time.
6. If a PDF was uploaded, its content is added to the prompt context.

📜 License
This project is licensed under the MIT License.




