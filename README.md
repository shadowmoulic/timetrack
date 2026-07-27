# ⏳ TimeTrack — Google Calendar Productivity & Time Intelligence

> A modern, high-aesthetic web application to track your personal productivity, sync Google Calendar events, auto-categorize time blocks using smart keyword rules, and visualize detailed output analytics.

![TimeTrack Screenshot Mockup](https://img.shields.io/badge/Status-Active_Development-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-React_18_%7C_Vite_%7C_Recharts-3b82f6?style=for-the-badge)

---

## ✨ Features

- 📅 **Google Calendar Live Sync**: Authenticate with Google Identity Services (`gsi/client`) to fetch events for Today, 7 Days, 14 Days, or 30 Days.
- 🏷️ **Smart Keyword Categorization**: Automatically tags calendar entries (e.g. `coding`, `github` → **Deep Work / Productive**; `gym` → **Health**; `netflix` → **Unproductive**).
- 📊 **Productivity Score (0-100%)**: Dynamic output score calculation based on productive vs. unproductive hours balance.
- 📈 **Interactive Visualizations**: Donut charts for category breakdown & stacked bar charts for daily output trends powered by Recharts.
- ⚡ **Instant Demo Mode**: Test and explore all features out-of-the-box with realistic simulated data without needing immediate OAuth login.
- ✏️ **Manual Time Entry & CSV Import/Export**: Log custom tasks, upload CSV files, or export formatted reports.
- ⚙️ **Custom Rules & Categories**: Add custom keyword rules, create custom categories, and set custom productivity multipliers (+1, 0, -1).
- 🎨 **Dark Glassmorphism Design**: Modern typography (Plus Jakarta Sans & JetBrains Mono), sleek animations, and responsive UI.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shadowmoulic/timetrack.git
cd timetrack
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Google Cloud Console OAuth Setup Guide

To sync live Google Calendar data, you need to configure a Google OAuth 2.0 Client ID:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Click the project dropdown and create a new project named **TimeTrack**.
2. **Enable Google Calendar API**:
   - Navigate to **APIs & Services → Library**.
   - Search for **Google Calendar API** and click **Enable**.
3. **Configure OAuth Consent Screen**:
   - Go to **OAuth consent screen** → Select **External**.
   - Fill in App name, developer contact email, and save.
   - Under **Scopes**, add `https://www.googleapis.com/auth/calendar.readonly`.
   - Under **Test Users**, add your Google email address.
4. **Create OAuth Client ID Credentials**:
   - Go to **Credentials → Create Credentials → OAuth client ID**.
   - Application Type: **Web application**.
   - **Authorized JavaScript origins**: Add `http://localhost:5173`.
   - Click **Create** and copy your generated **Client ID**.
5. **Add Client ID to TimeTrack**:
   - Click the **Settings** gear icon in the app header and paste your Client ID!

---

## 📁 Project Structure

```
timetrack/
├── src/
│   ├── components/
│   │   ├── Header.jsx             # Top Navbar & Auth Controls
│   │   ├── DashboardOverview.jsx  # Metric Cards & Productivity Score
│   │   ├── AnalyticsCharts.jsx    # Recharts Donut & Bar Charts
│   │   ├── EventsList.jsx         # Event Cards & Category Overrides
│   │   ├── RuleManagerModal.jsx   # Keyword Rule & Category Editor
│   │   ├── ManualEntryModal.jsx   # Manual Logger & CSV Importer
│   │   ├── SetupGuideModal.jsx    # Google Cloud Setup Guide
│   │   └── SettingsModal.jsx      # Client ID & Reset Controls
│   ├── services/
│   │   ├── categorizer.js         # Matching Engine & Score Formula
│   │   ├── googleCalendar.js      # OAuth Token Client & REST API Sync
│   │   └── mockData.js            # Simulated Dataset for Demo Mode
│   ├── config.js                  # Default Client ID, Categories & Rules
│   ├── index.css                  # Dark Glassmorphism Design System
│   ├── App.jsx                    # Root Container & State Management
│   └── main.jsx                   # React Entry Point
├── package.json
└── vite.config.js
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
