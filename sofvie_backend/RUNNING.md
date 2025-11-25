# Sofvie Prototype — Run Instructions (Local)

## Prereqs
- Docker & docker-compose OR Python 3.11+ and Node (for frontend preview)
- The repository root contains:
  - backend files (backend_app.py, models.py, ...)
  - data/sofvie_safety_dataset.csv (seed data)

## Quick with Docker-compose
1. Place the dataset at `./data/sofvie_safety_dataset.csv` (already included in this package).
2. Build and run:
   ```bash
   docker-compose up --build
   ```
3. Seed DB (inside container) or run locally:
   ```bash
   docker exec -it sofvie_api bash -c "python seed_db.py"
   ```
4. Open `http://localhost:8000/health` and `http://localhost:8000/docs` (FastAPI auto-docs).

## Run locally without Docker
1. Create virtualenv & install:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Seed DB:
   ```bash
   python seed_db.py
   ```
3. Start server:
   ```bash
   uvicorn backend_app:app --reload --host 0.0.0.0 --port 8000
   ```
4. Frontend: open `frontend/Dashboard.jsx` in your React app and proxy requests to the backend (or run a simple static server).