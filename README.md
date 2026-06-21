<div align="center">

<img src="public/banner.png" alt="PyBro Tutor Banner" width="100%" />

# 🐍 PyBro Tutor

### _Python from scratch, bro!_

An AI-powered interactive Python tutor that teaches you Python like a friendly, knowledgeable bro — with real code examples, quizzes, and conversational learning.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-00d2ff?style=for-the-badge&labelColor=0d1117)](https://python-tutor-nu.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=61dafb&labelColor=0d1117)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=646cff&labelColor=0d1117)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.5_Flash-4285f4?style=for-the-badge&logo=google&logoColor=4285f4&labelColor=0d1117)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0d1117)](https://vercel.com/)

[![GitHub stars](https://img.shields.io/github/stars/LAKSHMANAN-O7O5/python-tutor?style=flat-square&color=f7971e&labelColor=0d1117)](https://github.com/LAKSHMANAN-O7O5/python-tutor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/LAKSHMANAN-O7O5/python-tutor?style=flat-square&color=3fb950&labelColor=0d1117)](https://github.com/LAKSHMANAN-O7O5/python-tutor/network)
[![GitHub issues](https://img.shields.io/github/issues/LAKSHMANAN-O7O5/python-tutor?style=flat-square&color=58a6ff&labelColor=0d1117)](https://github.com/LAKSHMANAN-O7O5/python-tutor/issues)
[![License](https://img.shields.io/badge/license-MIT-c084fc?style=flat-square&labelColor=0d1117)](LICENSE)

---

**[🚀 Live Demo](https://python-tutor-nu.vercel.app/)** · **[📦 Report Bug](https://github.com/LAKSHMANAN-O7O5/python-tutor/issues)** · **[✨ Request Feature](https://github.com/LAKSHMANAN-O7O5/python-tutor/issues)**

</div>

---

## 📖 About

**PyBro Tutor** is an AI-powered Python learning companion built for beginners who want to learn Python the fun way — through conversation. Powered by **Google's Gemini 3.5 Flash**, PyBro acts as your coding buddy, explaining concepts with simple analogies, real code examples, and interactive quizzes after every topic.

> _"Python Marandha? No problem bro!"_ — PyBro 🐍

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Topic-Based Learning
Pick from **8 core Python topics** — from Variables to OOP — and get structured, beginner-friendly lessons with code examples.

### 🤖 AI-Powered Conversations
Powered by **Gemini 3.5 Flash** — ask follow-up questions, request more examples, or dive deeper into any concept.

### 🧠 Built-in Quizzes
Every lesson ends with a quiz question to test your understanding before moving on.

### 💾 Auto-Saved Progress
Your conversation history persists across sessions — close the app, come back later, and resume where you left off.

</td>
<td width="50%">

### 📋 One-Click Code Copy
All code blocks come with a copy button for easy use — paste directly into your editor and run.

### 🎨 GitHub Dark Theme
A sleek, developer-friendly dark interface inspired by GitHub's dark mode — easy on the eyes for long learning sessions.

### ⚡ Rate Limit Handling
Smart retry logic with exponential backoff ensures smooth operation even on Gemini's free tier.

### 📱 Fully Responsive
Works beautifully on desktop, tablet, and mobile — learn Python anywhere.

</td>
</tr>
</table>

---

## 🗂️ Topics Covered

| Icon | Topic | What You'll Learn |
|:----:|-------|-------------------|
| 📦 | **Variables & Data Types** | `int`, `float`, `str`, `bool` — the building blocks |
| 🔤 | **Strings** | Indexing, slicing, `upper()`, `lower()`, `split()`, `replace()` |
| 📋 | **Lists & Tuples** | Mutable vs immutable, `append()`, `remove()`, slicing |
| 🗂️ | **Dictionaries** | Key-value pairs, creating, accessing, looping |
| 🔀 | **If / Else** | Conditional logic with real-world examples |
| 🔁 | **Loops** | `for` loops, `while` loops, `range()` usage |
| ⚙️ | **Functions** | `def`, parameters, return values, default arguments |
| 🏗️ | **OOP & Classes** | Classes, `__init__`, `self`, attributes, methods |

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|:----------:|:--------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24" /> **React 19** | UI framework with hooks |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="24" /> **Vite 8** | Lightning-fast build tool |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" width="24" /> **Gemini 3.5 Flash** | AI-powered responses |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" width="24" /> **Vercel** | Serverless deployment |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" /> **Serverless Functions** | Secure API proxy |

</div>

---

## 🏗️ Architecture

```
python-tutor/
├── api/
│   └── gemini/
│       └── index.js          # Vercel serverless function (Gemini proxy)
├── public/
│   ├── banner.png             # README banner
│   ├── favicon.svg            # App favicon
│   └── icons.svg              # UI icons
├── src/
│   ├── App.jsx                # Main app — topics, chat, AI integration
│   ├── App.css                # Component styles
│   ├── index.css              # Global styles & design tokens
│   └── main.jsx               # React entry point
├── .env                       # API key (not committed)
├── vercel.json                # Vercel routing config
├── vite.config.js             # Vite + Gemini dev proxy
└── package.json               # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- A **Google Gemini API Key** — [Get one free here](https://aistudio.google.com/apikey)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/LAKSHMANAN-O7O5/python-tutor.git
cd python-tutor

# 2. Install dependencies
npm install

# 3. Create your environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173` 🎉

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com/new)
3. Add `GEMINI_API_KEY` as an environment variable in Vercel settings
4. Deploy — Vercel auto-detects Vite and the `/api` serverless functions

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|:---------|:------------|:--------:|
| `GEMINI_API_KEY` | Google Gemini API key for AI responses | ✅ |

---

## 🤝 Contributing

Contributions make the open-source community awesome! Any contributions you make are **greatly appreciated**.

1. **Fork** the project
2. **Create** your feature branch → `git checkout -b feature/amazing-feature`
3. **Commit** your changes → `git commit -m "Add amazing feature"`
4. **Push** to the branch → `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙌 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/) — For the powerful language model
- [React](https://react.dev/) — For the brilliant UI framework
- [Vite](https://vitejs.dev/) — For the blazing-fast dev experience
- [Vercel](https://vercel.com/) — For seamless serverless deployment

---

<div align="center">

**Built with ❤️ and 🐍 by [Lakshmanan](https://github.com/LAKSHMANAN-O7O5)**

⭐ Star this repo if PyBro helped you learn Python!

[![Star History Chart](https://api.star-history.com/svg?repos=LAKSHMANAN-O7O5/python-tutor&type=Date)](https://star-history.com/#LAKSHMANAN-O7O5/python-tutor&Date)

</div>
