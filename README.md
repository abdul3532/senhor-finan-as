# Senhor Finanças (FinMate)

Welcome to **Senhor Finanças**! This is a modern financial intelligence application built with a **React (Vite)** frontend and a **FastAPI** backend.

---

## 🚀 Quick Start

To run the full application, you will need two terminal windows: one for the backend and one for the frontend.

### Prerequisites
- **Python** (3.10 or higher)
- **Node.js** (v18 or higher)
- **Git**

### 1. Backend Setup (Terminal 1)

Navigate to the backend directory and set up the Python environment.

```powershell
# Go to backend folder
cd finmate-nextjs/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (if not exists) and add your keys
# Copy the example or create new one based on requirements
# required: GEMINI_API_KEY, etc.
```

**Run the Backend Server:**
```powershell
uvicorn main:app --reload --port 8000
```
> The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (Terminal 2)

Navigate to the frontend directory and start the UI.

```powershell
# Go to frontend folder
cd finmate-nextjs/frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```
> The App will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

The application requires the following environment variables. Create a `.env` file in `finmate-nextjs/backend/.env`.

**Required:**
- `OPENAI_API_KEY`: API Key for OpenAI (GPT-4o is used by default).
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_KEY`: Your Supabase Anon/Service Role Key.

**Optional (Frontend):**
- `VITE_API_URL`: Backend URL (Default: `http://localhost:8000`). Create this in `finmate-nextjs/frontend/.env` if needed.
