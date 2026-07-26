import os
import sqlite3
from flask import Flask, request, jsonify, render_template
from predict import PhishingPredictor

app = Flask(__name__)
predictor = PhishingPredictor()

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scan_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            scan_type TEXT,
            target TEXT,
            classification TEXT,
            risk_score INTEGER,
            confidence INTEGER
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_name TEXT,
            score INTEGER,
            total INTEGER,
            percentage REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return jsonify({
        "status": "online",
        "system": "AI Phishing Awareness & Detection System (B.Tech Project)",
        "endpoints": ["/api/scan/url", "/api/scan/email", "/api/dashboard", "/api/quiz"]
    })

@app.route('/api/scan/url', methods=['POST'])
def scan_url():
    data = request.json or {}
    url = data.get('url', '')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    res = predictor.analyze_url(url)
    
    # Log to SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO scan_logs (scan_type, target, classification, risk_score, confidence) VALUES (?, ?, ?, ?, ?)",
        ('url', url, res['classification'], res['risk_score'], res['confidence'])
    )
    conn.commit()
    conn.close()

    return jsonify(res)

@app.route('/api/scan/email', methods=['POST'])
def scan_email():
    data = request.json or {}
    content = data.get('content', '')
    if not content:
        return jsonify({'error': 'Email content is required'}), 400

    res = predictor.analyze_email(content)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO scan_logs (scan_type, target, classification, risk_score, confidence) VALUES (?, ?, ?, ?, ?)",
        ('email', content[:100], res['classification'], res['risk_score'], res['confidence'])
    )
    conn.commit()
    conn.close()

    return jsonify(res)

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*), classification FROM scan_logs GROUP BY classification")
    rows = cursor.fetchall()
    
    stats = {'Safe': 0, 'Suspicious': 0, 'Phishing': 0, 'Total': 0}
    for count, cls in rows:
        if cls in stats:
            stats[cls] = count
        stats['Total'] += count

    cursor.execute("SELECT id, timestamp, scan_type, target, classification, risk_score FROM scan_logs ORDER BY id DESC LIMIT 10")
    recent = cursor.fetchall()
    conn.close()

    return jsonify({
        'stats': stats,
        'recent_scans': [
            {'id': r[0], 'timestamp': r[1], 'type': r[2], 'target': r[3], 'classification': r[4], 'risk_score': r[5]}
            for r in recent
        ]
    })

if __name__ == '__main__':
    print("Starting Flask Server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
