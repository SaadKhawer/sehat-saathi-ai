# 🌿 Sehat Saathi AI — صحت ساتھی

> **AI-powered healthcare companion for Pakistani families**  
> Symptom checker · Health tracker · Medical assistant · Diet & Medicine info

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Overview

**Sehat Saathi** (صحت ساتھی) is a full-stack AI-powered healthcare web application designed specifically for Pakistani families. It provides intelligent health guidance in **both Urdu and English**, using local medical knowledge (dengue, typhoid, malaria, TB) and Pakistani pharmacy pricing.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🩺 **AI Symptom Checker** | Chat-based symptom analysis with Urdu + English responses |
| 📊 **Health Dashboard** | Daily health score, AI tips & notifications |
| 💧 **Habit Tracker** | Track water intake, sleep & physical activity |
| 👨‍👩‍👧‍👦 **Family Profiles** | Manage health records for all family members |
| 📋 **AI Health Reports** | Generate & download PDF health reports |
| 💊 **Medicine Info** | Pakistani medicine prices, doses & alternatives |
| 🍽️ **Diet Planner** | Condition-based desi meal plans |
| 🧠 **Mental Health** | Empathetic AI companion in Urdu |
| 🚨 **Emergency SOS** | One-tap emergency numbers (1122, 115, 1021) |
| 🔔 **Health Alerts** | Vaccine reminders & regional disease alerts |
| 📈 **Health Trends** | Visual charts for health data over time |
| 🩹 **First Aid Guide** | Step-by-step first aid in Urdu & English |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **React Router v6** — client-side routing
- **Firebase Auth** — Google & Email/Password login
- **Axios** — API communication
- **Custom CSS** — Inter font, glassmorphism design

### Backend
- **Node.js** + **Express.js**
- **Firebase Admin SDK** — Firestore database
- **Groq AI API** — LLaMA 3.3 70B (fast & free)
- **PDFKit** — Health report generation
- **JWT** — Secure authentication

### Cloud
- **Firebase Firestore** — Real-time NoSQL database
- **Firebase Authentication** — Multi-provider auth

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project ([console.firebase.google.com](https://console.firebase.google.com))
- Groq API key ([console.groq.com](https://console.groq.com)) — Free

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/sehat-saathi-ai.git
cd sehat-saathi-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
GROK_API_KEY=your_groq_api_key_here
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
```

Add your Firebase service account key:
```
backend/config/serviceAccountKey.json
```

Start backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore Database** → Start in test mode → Region: `asia-south1`
4. Download **Service Account Key** → save as `backend/config/serviceAccountKey.json`

---

## 📁 Project Structure

```
sehat-saathi-ai/
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API calls & Firebase config
│   │   ├── components/   # Layout, ErrorBoundary
│   │   ├── context/      # Auth & Language context
│   │   └── pages/        # All page components
│   └── .env
├── backend/
│   ├── config/           # Firebase admin setup
│   ├── controllers/      # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── routes/           # Express routes
│   ├── services/         # Groq AI service & PDF service
│   └── server.js
└── README.md
```

---

## 🌐 Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `GROK_API_KEY` | Groq API key from console.groq.com |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 🔒 Security Notes

> ⚠️ **Never commit these files to GitHub:**
> - `backend/.env`
> - `backend/config/serviceAccountKey.json`
> - `frontend/.env`

These are already included in `.gitignore`.

---

## 🤖 AI Model

This app uses **Groq's LLaMA 3.3 70B** model — a free, ultra-fast inference API.

- Get your free API key at [console.groq.com](https://console.groq.com)
- No credit card required for free tier
- Supports Urdu + English responses

---

## 🇵🇰 Pakistani Healthcare Knowledge

The AI is pre-trained with Pakistani-specific medical guidelines:
- 🦟 Dengue protocol (NO aspirin, only Panadol)
- 🌡️ Typhoid treatment (Ceftriaxone/Azithromycin)
- 💊 Local brand names & PKR pricing
- 🏥 Free government hospital info (DOTS, Sehat Sahulat)
- 🚑 Emergency numbers: 1122, 115, 1021, 0317-4288665

---

## 📸 Future Improvements

We are continuously working to make Sehat Saathi better. Here's what's coming next:

| # | Feature | Description |
|---|---------|-------------|
| 📱 | **Mobile App Version** | Native Android & iOS app using React Native for on-the-go health monitoring |
| 🧬 | **AI Disease Prediction** | Machine learning models trained on Pakistani patient data for early disease detection |
| 🩻 | **Medical Image Analysis** | Upload X-rays, reports & skin images for AI-powered visual diagnosis assistance |
| 🧠 | **Voice-Based AI Assistant** | Talk to Sehat Saathi in Urdu using your voice — hands-free health guidance |
| 🌍 | **Multi-language Support** | Expand beyond Urdu/English — add Punjabi, Sindhi, Pashto & regional languages |
| 🏥 | **Doctor Appointment System** | Book verified doctor appointments online with location-based search across Pakistan |

> 💡 Have a feature suggestion? Open an [issue](../../issues) — we'd love to hear from you!

---

## 📄 License

MIT License — free to use and modify.

---

## 👨‍💻 Author

Built with ❤️ for Pakistani families.

> *"Sehat hi daulat hai" — Health is wealth*  
> صحت ہی دولت ہے
