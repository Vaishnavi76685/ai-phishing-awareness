import React, { useState } from 'react';
import { Cpu, Link, Mail, Upload, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, ArrowRight, FileText, RefreshCw } from 'lucide-react';
import { ScanResult } from '../types/phishing';

interface PhishingDetectorProps {
  initialTarget?: string;
  initialType?: 'url' | 'email';
}

export const PhishingDetector: React.FC<PhishingDetectorProps> = ({
  initialTarget = '',
  initialType = 'url',
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'email' | 'file'>(initialType);
  const [urlInput, setUrlInput] = useState(initialTarget);
  const [emailInput, setEmailInput] = useState(initialTarget);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      let endpoint = '/api/scan/url';
      let payload: any = {};

      if (activeTab === 'url') {
        endpoint = '/api/scan/url';
        payload = { url: urlInput };
      } else if (activeTab === 'email') {
        endpoint = '/api/scan/email';
        payload = { content: emailInput };
      } else {
        endpoint = '/api/scan/file';
        payload = { filename: selectedFile?.name || 'uploaded_sample.txt', fileContent };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to analyze');
      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">AI Phishing Detector</h1>
        <p className="text-slate-500 text-sm">
          Paste an email, URL, or upload a text file to trigger machine learning classification and heuristic indicator extraction.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center space-x-2 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Paste URL</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Paste Email Text</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center space-x-2 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Text File</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScan} className="space-y-4">
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target URL</label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/login or http://192.168.1.1/update"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">Supports IP URLs, typosquatting domains, shortened links, and encoded strings.</p>
            </div>
          )}

          {activeTab === 'email' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Content</label>
              <textarea
                rows={5}
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Paste suspicious email text, subject lines, or header snippet..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select .txt or .eml file</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  accept=".txt,.eml,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : 'Click to select or drag and drop a file'}
                  </p>
                  <p className="text-[11px] text-slate-500">Supports raw text documents and exported email headers</p>
                </label>
              </div>

              {fileContent && (
                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 max-h-32 overflow-y-auto border border-slate-800">
                  {fileContent}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Prediction Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ANALYZE CONTENT NOW</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {scanResult && (
        <div className="space-y-6">
          {/* Classification & Risk Score Header Card */}
          <div className={`p-6 rounded-xl border shadow-sm ${
            scanResult.classification === 'Phishing'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : scanResult.classification === 'Suspicious'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                  scanResult.classification === 'Phishing' ? 'bg-rose-100 text-rose-600' :
                  scanResult.classification === 'Suspicious' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {scanResult.classification === 'Phishing' ? <ShieldAlert className="w-7 h-7" /> :
                   scanResult.classification === 'Suspicious' ? <AlertTriangle className="w-7 h-7" /> :
                   <CheckCircle className="w-7 h-7" />}
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider opacity-75">Analysis Result</div>
                  <h2 className="text-2xl font-bold">{scanResult.classification} Detected</h2>
                  <p className="text-xs mt-0.5 opacity-80">Confidence Score: {scanResult.confidenceScore}% • Target: {scanResult.target}</p>
                </div>
              </div>

              {/* Risk Meter Dial */}
              <div className="flex items-center space-x-4 bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Risk Index</div>
                  <div className="text-2xl font-extrabold text-slate-900">{scanResult.riskScore}%</div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  scanResult.riskScore > 50 ? 'bg-rose-100 text-rose-700' :
                  scanResult.riskScore > 20 ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {scanResult.riskScore > 50 ? 'High Risk' : scanResult.riskScore > 20 ? 'Warning' : 'Low Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicators Breakdown & AI Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Indicators List */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Detected Feature Signals ({scanResult.indicators.length})</span>
              </h3>

              <div className="space-y-3">
                {scanResult.indicators.map((ind, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className={ind.type === 'danger' ? 'text-rose-600' : ind.type === 'warning' ? 'text-amber-600' : 'text-emerald-600'}>
                        {ind.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 font-bold rounded uppercase">
                        +{ind.weight} Score
                      </span>
                    </div>
                    <p className="text-slate-600">{ind.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Technical Report & Prevention Tips */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Threat Analysis Summary</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono">
                  {scanResult.aiExplanation}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Defensive Recommendations</h3>
                <ul className="space-y-2">
                  {scanResult.preventionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
