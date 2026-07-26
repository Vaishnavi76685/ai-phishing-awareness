# AI Phishing Awareness & Detection System 🛡️
### Final Year B.Tech Cyber Security Project

An intelligent, full-stack cybersecurity defense and awareness platform built with **Python Flask**, **Scikit-learn Machine Learning**, **SQLite**, **Tailwind CSS**, and **React**.

---

## 🎯 Educational Objectives & Ethical Compliance
* Strictly designed for **cybersecurity defensive research, education, and threat awareness**.
* **Zero Credential Harvesting**: The mock login portal never stores, transmits, or logs credentials.
* Provides real-time feature extraction for malicious URLs and phishing emails.

---

## 🏗️ System Architecture & Technologies

### Stack
- **Backend**: Python Flask 3.0 / Express Node.js
- **Machine Learning**: Scikit-learn (RandomForest Classifier, TF-IDF Vectorization)
- **Database**: SQLite3 / In-Memory JSON Store
- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Recharts, Motion
- **Deployment**: Render / Railway / Replit / Docker / Cloud Run

---

## 🚀 Local Quickstart Guide (Python Flask)

### Prerequisites
- Python 3.9+
- `pip` package manager

### 1. Clone & Setup Virtual Environment
```bash
git clone <repo-url>
cd python_project
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train the Scikit-learn ML Model
```bash
python train_model.py
```
*Output: Generates `models/phishing_model.pkl` and `models/vectorizer.pkl`.*

### 4. Run the Flask Web Server
```bash
python app.py
```
*App will start on `http://localhost:5000`*

---

## 🌐 Deployment Instructions

### A. Deploy on Render
1. Push your repository to GitHub.
2. Log into [Render.com](https://render.com) and click **New + > Web Service**.
3. Select your repository.
4. Set Build Command: `pip install -r python_project/requirements.txt && python python_project/train_model.py`
5. Set Start Command: `cd python_project && gunicorn app:app`
6. Click **Create Web Service**.

### B. Deploy on Railway
1. Click **New Project** on Railway.
2. Select **Deploy from GitHub repo**.
3. Railway automatically detects `python_project/Procfile` and boots Gunicorn.

### C. Deploy on Replit
1. Import repository to Replit.
2. Run `pip install -r python_project/requirements.txt`.
3. Hit **Run** (`python python_project/app.py`).

---

## 📊 Features Included
1. **AI Phishing Detector**: Real-time URL & Email heuristic classification with threat breakdown.
2. **Mock Login Demonstration**: Educational credential harvesting awareness module.
3. **Deep URL & Email Analyzer**: IP host check, domain entropy, subdomains, TLDs, shorteners, HTTPS, urgency keywords.
4. **20-Question Awareness Quiz**: Score tracking, scenario analysis, and progress metrics.
5. **Security Analytics Dashboard**: Recharts visual graphs, threat trends, and category distribution.
6. **Password-Protected Admin Panel**: Audit logs, report exports, and quiz management.
