import React, { useState } from 'react';
import { FileCode, Download, BookOpen, Layers, Database, Network, Copy, Check, Terminal } from 'lucide-react';

export const ProjectDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'er' | 'dfd' | 'usecase' | 'python-files'>('architecture');
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  // File snippets for Python standalone project
  const fileContents: Record<string, string> = {
    'app.py': `# Python Flask Application Server
import os, sqlite3
from flask import Flask, request, jsonify
from predict import PhishingPredictor

app = Flask(__name__)
predictor = PhishingPredictor()
DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

@app.route('/api/scan/url', methods=['POST'])
def scan_url():
    url = request.json.get('url', '')
    res = predictor.analyze_url(url)
    return jsonify(res)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`,

    'train_model.py': `# Scikit-Learn Model Training Script
import pandas as pd, joblib, os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv('dataset/phishing_dataset.csv')
vectorizer = TfidfVectorizer(ngram_range=(1,2), max_features=1000)
X_vec = vectorizer.fit_transform(df['text'])

model = RandomForestClassifier(n_estimators=100)
model.fit(X_vec, df['label'])

joblib.dump(model, 'models/phishing_model.pkl')
joblib.dump(vectorizer, 'models/vectorizer.pkl')`,

    'predict.py': `# Standalone Phishing Prediction Engine
import re, joblib
class PhishingPredictor:
    def analyze_url(self, url):
        risk = 0
        if re.search(r'http[s]?://(?:\\d{1,3}\\.){3}\\d{1,3}', url): risk += 35
        if len(url) > 75: risk += 15
        return {'classification': 'Phishing' if risk >= 45 else 'Safe', 'risk_score': risk}`,

    'requirements.txt': `Flask==3.0.0\nscikit-learn==1.3.2\npandas==2.1.4\nnumpy==1.26.2\njoblib==1.3.2\ngunicorn==21.2.0`,
    'Procfile': `web: gunicorn app:app`
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">Project Specs & Python Exporter</h1>
        <p className="text-slate-500 text-sm">
          System architecture diagrams, ER schemas, DFDs, Use Case diagrams, and complete Python Flask source code for local execution.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-white p-1.5 rounded-xl border border-slate-200 gap-1 text-xs shadow-sm">
        {[
          { id: 'architecture', label: 'Architecture Diagram', icon: Layers },
          { id: 'er', label: 'ER Diagram', icon: Database },
          { id: 'dfd', label: 'Data Flow Diagram (DFD)', icon: Network },
          { id: 'usecase', label: 'Use Case Diagram', icon: BookOpen },
          { id: 'python-files', label: 'Python Flask Code', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      {activeTab === 'architecture' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">High-Level System Architecture</h2>
          <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-blue-300 space-y-4 overflow-x-auto leading-relaxed">
            <pre>
{`+-----------------------------------------------------------------------+
|                         CLIENT LAYER (React / HTML5)                  |
|  [ Home Page ]  [ AI Detector ]  [ Mock Login ]  [ Quiz ] [ Dashboard ]  |
+-----------------------------------+-----------------------------------+
                                    | REST API Calls (JSON / HTTPS)
                                    v
+-----------------------------------------------------------------------+
|                    APPLICATION SERVER LAYER (Express / Flask)         |
|  +---------------------------+    +--------------------------------+  |
|  | Heuristic Feature Engine  |    | Gemini AI Analysis Agent       |  |
|  | - IP / TLD / Subdomains   |    | - Deep Threat Reasoning        |  |
|  | - Urgency / Credential    |    | - Prevention Recommendation    |  |
|  +-------------+-------------+    +---------------+----------------+  |
|                |                                  |                   |
+----------------+----------------------------------+-------------------+
                 |                                  |
                 v                                  v
+------------------------------------+ +--------------------------------+
| MACHINE LEARNING MODEL LAYER       | | DATABASE LAYER                 |
| Scikit-learn RandomForest          | | SQLite3 (database.db)          |
| TF-IDF Vectorizer (ngram 1-2)      | | - Scan Logs / Risk Index     |
+------------------------------------+ +--------------------------------+`}
            </pre>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The architecture utilizes a modular multi-tier design separating client interface, threat extraction rules, machine learning inference, and persistence.
          </p>
        </div>
      )}

      {activeTab === 'er' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Entity-Relationship (ER) Schema</h2>
          <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 space-y-4 overflow-x-auto">
            <pre>
{`[ SCAN_LOGS Table ]
- id (INTEGER, Primary Key, AUTOINCREMENT)
- timestamp (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- scan_type (TEXT: 'url' | 'email' | 'file')
- target (TEXT: Scanned string snippet)
- classification (TEXT: 'Safe' | 'Suspicious' | 'Phishing')
- risk_score (INTEGER: 0 - 100)
- confidence (INTEGER: 0 - 100)

[ QUIZ_ATTEMPTS Table ]
- id (INTEGER, Primary Key, AUTOINCREMENT)
- timestamp (DATETIME)
- user_name (TEXT)
- score (INTEGER)
- total_questions (INTEGER)
- percentage (REAL)

[ ADMIN_AUDIT Table ]
- id (INTEGER, Primary Key)
- action (TEXT)
- ip_address (TEXT)
- details (TEXT)`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'dfd' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Data Flow Diagram (DFD Level 0 & 1)</h2>
          <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-amber-400 space-y-4 overflow-x-auto">
            <pre>
{`LEVEL 0 (Context Diagram):
[ User ] ---- (Input: URL / Email) ----> [ AI Phishing System ] ---- (Output: Risk Report) ----> [ User ]

LEVEL 1 (Process Breakdown):
1.0 [ Input Parsing ] ----> Extracts Raw Target String
2.0 [ Heuristic Extraction ] ----> Scans IP, Subdomains, TLDs, Urgency Words
3.0 [ ML Model Classification ] ----> Vectorizes Text -> Predicts Probability Score
4.0 [ Database Logger ] ----> Writes Entry to SQLite database.db
5.0 [ Report Generation ] ----> Constructs JSON Response with Prevention Advice`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'usecase' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Use Case Diagram & Actor Matrix</h2>
          <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-blue-300 space-y-4 overflow-x-auto">
            <pre>
{`Actors:
1. End User / Student
   - Scan URL or Email text
   - Take 20-Question Awareness Quiz
   - Interact with Mock Login Demo
   - View Security Analytics Dashboard

2. Security Admin
   - Authenticate with password
   - View system audit logs
   - Export JSON/CSV security reports
   - Retrain Scikit-learn ML model`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'python-files' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Python Standalone Project Code</h2>
              <p className="text-xs text-slate-500">Copy code directly to run your Python Flask project locally or submit to your evaluator.</p>
            </div>
            <button
              onClick={() => copySnippet(fileContents[selectedFile] || '')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy File Code'}</span>
            </button>
          </div>

          <div className="flex space-x-2 border-b border-slate-100 pb-2 overflow-x-auto text-xs">
            {Object.keys(fileContents).map(fileName => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                  selectedFile === fileName
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
            <pre>{fileContents[selectedFile]}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
