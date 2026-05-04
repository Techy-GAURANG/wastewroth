# ♻ WasteWorth – AI-Powered Waste Reuse PWA

> **B.Tech Final Year Project** – Computer Science & Engineering  
> AI-Powered Waste Reuse Application | Progressive Web App

[![PWA](https://img.shields.io/badge/PWA-Ready-1a7a4a)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌍 Overview

WasteWorth is an AI-powered Progressive Web App (PWA) that helps users identify household waste materials through camera or gallery upload, and provides curated step-by-step reuse/upcycling suggestions. Built as a final year B.Tech project demonstrating full-stack PWA development, AI integration, and sustainable technology.

**Live Demo:** [Deploy on GitHub Pages] → `https://<your-username>.github.io/wastewroth-pwa/`

---

## ✨ Features

| Feature | Description |
|---|---|
| 📷 **Camera Upload** | Scan waste items directly using device camera |
| 🖼 **Gallery Upload** | Upload existing photos from device gallery |
| 🤖 **AI Classification** | Classifies waste using Claude AI (Anthropic API) |
| 🗄 **Local Database** | IndexedDB stores all data offline |
| ♥ **Favourites** | Save and manage favourite reuse ideas |
| 📊 **Analytics** | Charts showing scan history, material distribution, activity |
| 🔑 **API Key Settings** | Configure your Anthropic API key in Settings tab |
| 🔐 **Authentication** | Secure login/register with SHA-256 password hashing |
| 🌙 **Dark Mode** | Full dark theme support |
| 📱 **PWA** | Installable, works offline, mobile-first |

---

## 🚀 Getting Started

### Option 1: GitHub Pages (Recommended)

1. **Fork or clone** this repository
2. Go to your repo → **Settings → Pages**
3. Set source to `main` branch, root `/`
4. Visit `https://<username>.github.io/wastewroth-pwa/`

### Option 2: Local Development

```bash
# Clone the repo
git clone https://github.com/<your-username>/wastewroth-pwa.git
cd wastewroth-pwa

# Serve locally (Python)
python -m http.server 8080

# Or using Node.js
npx serve .

# Open browser
open http://localhost:8080
```

> **Important:** Must be served over HTTP/HTTPS (not `file://`) for camera, service worker, and IndexedDB to work correctly.

---

## 🔑 Setting up the Anthropic API Key

1. Get a free API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the app → Go to **⚙ Settings** tab
3. Under **AI Configuration**, paste your API key
4. Select your preferred model (Sonnet recommended)
5. Click **Test Connection** to verify
6. Click **Save Key**

Without an API key, the app still works using a simulated offline classifier.

---

## 🏗 Architecture

```
wastewroth-pwa/
├── index.html          # Main SPA entry point
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── css/
│   └── main.css        # All styles (CSS variables, responsive)
├── js/
│   ├── db.js           # IndexedDB layer (users, saved ideas, history)
│   ├── auth.js         # SHA-256 authentication
│   ├── data.js         # Waste materials & suggestions database
│   ├── camera.js       # Camera/gallery capture & processing
│   ├── ai.js           # Anthropic API integration
│   ├── charts.js       # Canvas-based analytics charts
│   └── app.js          # Main controller (navigation, modals, UI)
└── icons/
    ├── icon-192.svg
    └── icon-512.svg
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES2022) |
| Storage | IndexedDB (offline-first) |
| AI | Anthropic Claude API (Vision) |
| Auth | SHA-256 via Web Crypto API |
| PWA | Service Worker, Web App Manifest |
| Charts | Custom Canvas API implementation |
| Fonts | Syne + Space Grotesk (Google Fonts) |

---

## 📱 Supported Waste Categories

| # | Material | Sample Reuse Ideas |
|---|---|---|
| 1 | 🧴 Plastic Bottle | Flower Pot, Bird Feeder, Self-Watering Planter |
| 2 | 🥫 Tin Can | Pencil Holder, Herb Planter, Lantern |
| 3 | 📦 Cardboard | Desk Organiser, Playhouse |
| 4 | 🫙 Glass Jar | Fairy Light Lantern, Storage Jar |
| 5 | 🧵 Fabric | Tote Bag, Patchwork Cushion |
| 6 | 📄 Paper | Papier-Mâché Bowl |
| 7 | ⚫ Rubber | Garden Gaskets |
| 8 | 🪵 Wood | Pallet Coffee Table, Herb Box |

---

## 🔒 Security

- Passwords hashed with **SHA-256 + random salt** (Web Crypto API)
- API keys stored only in **IndexedDB** (local device storage)
- No external tracking or analytics
- All data stays on-device

---

## 📊 Key Metrics (from project report)

- Model Accuracy: **89.6%** (MobileNetV2 TFLite)
- UAT Satisfaction: **4.3/5.0** (35 participants)
- Task Completion: **94.3%**
- Avg. Inference: **312ms** (mid-range Android)

---

## 🔮 Future Enhancements

- [ ] Camera-based real-time classification (TensorFlow.js)
- [ ] Cloud sync (Firebase)
- [ ] Community idea sharing
- [ ] Multi-language support (Hindi, Spanish)
- [ ] AR overlay with ARCore WebXR
- [ ] Gamification & leaderboard

---

## 📄 License

MIT License — free for academic and personal use.

---

## 👤 Author

**[Student Name]** | Roll No: [XXXXXXXX]  
Department of Computer Science & Engineering  
[Institution Name] | Academic Year 2024–2025  

*Supervised by: [Supervisor Name], [Designation]*
