# ⚡ GhostDebug AI – Autonomous Debugging Agent

GhostDebug AI is an autonomous, multi-agent debugging system built for hackathons. It demonstrates a complete AI reasoning loop: analyzing errors, proposing fixes, reflecting on the outcomes, and automatically retrying if the fix fails.

*"This AI system thinks, acts, and corrects itself autonomously."*

## ✨ Features

- **Multi-Agent Architecture**: 
  - 🧠 **Manager Agent**: Orchestrates the debugging workflow.
  - 🔍 **Research Agent**: Analyzes the root cause of the error.
  - 🛠️ **Fix Agent**: Applies patches and generates alternative solutions.
  - 🔁 **Reflection Agent**: Validates if the fix actually resolves the error.
- **Terminal-Style Logs**: Real-time visibility into the agents' thought processes, retries, and decision-making.
- **Self-Correction (Retry Loop)**: If an applied fix is deemed insufficient by the Reflection Agent, the system automatically retries with a new strategy.
- **"Wow Factor" Alternatives**: Upon successful resolution, the system not only provides the chosen fix but also suggests alternative approaches (e.g., explicit type casting vs. nullish fallback).

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **API**: REST (`/api/debug`)

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Start the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm start
```
*The backend will run on `http://localhost:5000`.*

### 2. Start the Frontend
Open a new, separate terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will typically run on `http://localhost:5173` (or `5174`).*

## 🎮 How to Use (Demo Experience)

To experience the full autonomous self-correction loop, use the built-in **Demo Mode**:

1. Open the frontend in your browser.
2. Click the **Demo Mode** button. This will automatically populate the inputs with a specific syntax error scenario.
3. Click **Run Workflow**.
4. **Watch the logs**:
   - **Attempt 1**: The Fix Agent will intentionally apply a weak/conservative patch. The Reflection Agent will catch that it is incomplete and trigger a **Retry**.
   - **Attempt 2**: The system will analyze the failure, apply a stronger fix, and succeed.
5. Review the **Fixed Code** and **Alternative Fixes Considered** in the output panel.

## 📁 Project Structure
- `/backend/agents/`: Contains the logic for the individual AI agents (Manager, Research, Fix, Reflection).
- `/frontend/src/components/`: Contains the React UI components (`LogsPanel`, `OutputPanel`, `DebugForm`).
