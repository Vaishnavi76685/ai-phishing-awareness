import React, { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle, Search, FileCode, Sparkles } from 'lucide-react';

export const EmailAnalyzer: React.FC = () => {
  const [emailText, setEmailText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const runEmailInspection = (content: string) => {
    if (!content.trim()) return;

    const lower = content.toLowerCase();

    // Trigger categories
    const urgencyWords = ['urgent', 'immediately', '24 hours', 'suspended', 'terminated', 'action required', 'final notice', 'unauthorized access'];
    const credWords = ['password', 'verify credentials', 'ssn', 'social security', 'login now', 'bank details', 'credit card'];
    const moneyWords = ['wire transfer', 'gift card', 'bitcoin', 'crypto', 'invoice overdue', 'payment required'];
    const genericSalutations = ['dear customer', 'dear user', 'valued account holder', 'dear account owner'];

    const foundUrgency = urgencyWords.filter(w => lower.includes(w));
    const foundCreds = credWords.filter(w => lower.includes(w));
    const foundMoney = moneyWords.filter(w => lower.includes(w));
    const foundGreetings = genericSalutations.filter(w => lower.includes(w));

    // Extract links
    const extractedLinks = content.match(/https?:\/\/\S+/g) || [];

    let riskScore = 0;
    if (foundUrgency.length > 0) riskScore += 30;
    if (foundCreds.length > 0) riskScore += 35;
    if (foundMoney.length > 0) riskScore += 25;
    if (foundGreetings.length > 0) riskScore += 15;
    if (extractedLinks.length > 0) riskScore += 10;

    setAnalysis({
      characterCount: content.length,
      wordCount: content.trim().split(/\s+/).length,
      foundUrgency,
      foundCreds,
      foundMoney,
      foundGreetings,
      extractedLinks,
      riskScore: Math.min(100, riskScore),
      verdict: riskScore >= 45 ? 'Phishing Email' : riskScore >= 20 ? 'Suspicious Email' : 'Safe / Clean Email'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">Email Text Inspector</h1>
        <p className="text-slate-500 text-sm">
          Scans email bodies and header snippets for urgency coercion, credential harvesting triggers, financial traps, and embedded link counts.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Paste Email Body Content</label>
        <textarea
          rows={6}
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="URGENT: Your Office365 password expires today. Click here to verify credentials..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => runEmailInspection(emailText)}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Inspect Email Body</span>
        </button>
      </div>

      {analysis && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Text Analysis Verdict</div>
              <div className={`text-xl font-bold ${
                analysis.riskScore > 50 ? 'text-rose-600' : analysis.riskScore > 20 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {analysis.verdict}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Risk Index</div>
              <div className="text-2xl font-extrabold text-slate-900">{analysis.riskScore}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-amber-600 uppercase tracking-wider text-[11px]">Urgency & Fear Language</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.foundUrgency.length > 0 ? (
                  analysis.foundUrgency.map((word: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">None detected</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-rose-600 uppercase tracking-wider text-[11px]">Credential Harvest Prompts</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.foundCreds.length > 0 ? (
                  analysis.foundCreds.map((word: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">None detected</span>
                )}
              </div>
            </div>
          </div>

          {analysis.extractedLinks.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Extracted Embedded Links ({analysis.extractedLinks.length})</span>
              <div className="space-y-1 font-mono text-[11px] text-blue-600 break-all">
                {analysis.extractedLinks.map((link: string, i: number) => (
                  <div key={i} className="p-2 bg-white rounded border border-slate-200">{link}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
