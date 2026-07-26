import React, { useState } from 'react';
import { Link, Shield, AlertTriangle, CheckCircle, Search, ExternalLink, Globe, Lock } from 'lucide-react';

export const UrlAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const runDetailedUrlAnalysis = (targetUrl: string) => {
    const cleanUrl = targetUrl.trim();
    let hostname = '';
    let protocol = '';
    let path = '';

    try {
      const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `http://${cleanUrl}`);
      hostname = parsed.hostname;
      protocol = parsed.protocol;
      path = parsed.pathname;
    } catch (e) {
      hostname = cleanUrl;
    }

    const checks = [
      {
        name: 'IP-Based URL Hostname',
        description: 'Checks if the domain uses a raw IP address instead of a domain name',
        passed: !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname),
        weight: 35,
        detail: /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) ? `Detected IP: ${hostname}` : 'Valid domain name string'
      },
      {
        name: 'High-Risk TLD (.xyz, .top, .tk)',
        description: 'Evaluates top-level domain reputation',
        passed: !['.xyz', '.top', '.tk', '.zip', '.click', '.gq'].some(tld => hostname.endsWith(tld)),
        weight: 25,
        detail: hostname.includes('.') ? `TLD: .${hostname.split('.').pop()}` : 'No TLD'
      },
      {
        name: 'Subdomain Count Depth',
        description: 'Identifies excessive nested subdomains used to hide real targets',
        passed: hostname.split('.').length <= 3,
        weight: 20,
        detail: `${hostname.split('.').length - 2} subdomain levels detected`
      },
      {
        name: 'URL Shortener Proxy Service',
        description: 'Checks for masking services like bit.ly, tinyurl, or is.gd',
        passed: !['bit.ly', 'tinyurl.com', 'is.gd', 'goo.gl', 't.co'].some(s => cleanUrl.toLowerCase().includes(s)),
        weight: 20,
        detail: ['bit.ly', 'tinyurl.com', 'is.gd'].some(s => cleanUrl.toLowerCase().includes(s)) ? 'Shortener detected' : 'Standard destination URL'
      },
      {
        name: 'HTTPS Transport Encryption',
        description: 'Verifies SSL/TLS secure protocol usage',
        passed: cleanUrl.toLowerCase().startsWith('https://'),
        weight: 10,
        detail: cleanUrl.toLowerCase().startsWith('https://') ? 'Encrypted via HTTPS' : 'Unencrypted HTTP protocol'
      },
      {
        name: 'Excessive Character Length (>75 chars)',
        description: 'Checks if URL length exceeds standard threshold',
        passed: cleanUrl.length <= 75,
        weight: 15,
        detail: `Length: ${cleanUrl.length} characters`
      },
      {
        name: 'Obfuscation Symbols (@ or //)',
        description: 'Scans for @ symbols or double slashes in path',
        passed: !cleanUrl.includes('@') && !path.includes('//'),
        weight: 25,
        detail: cleanUrl.includes('@') ? '@ symbol found' : 'No obfuscation characters'
      }
    ];

    let riskScore = 0;
    checks.forEach(c => {
      if (!c.passed) riskScore += c.weight;
    });

    setAnalysis({
      targetUrl: cleanUrl,
      hostname,
      protocol,
      riskScore: Math.min(100, riskScore),
      checks
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">URL Deep Inspector</h1>
        <p className="text-slate-500 text-sm">
          Perform feature-level structural extraction on any web link to evaluate host IP anomalies, subdomains, TLD risk, and protocol security.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Enter Link or Domain</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.1/login or https://paypal-security-update.tk"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => runDetailedUrlAnalysis(url)}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Analyze Link</span>
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scanned Hostname</div>
              <div className="text-lg font-mono font-bold text-slate-900">{analysis.hostname}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Risk Index</div>
              <div className={`text-2xl font-extrabold ${
                analysis.riskScore > 50 ? 'text-rose-600' : analysis.riskScore > 20 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {analysis.riskScore}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Feature Extraction Matrix
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {analysis.checks.map((check: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {check.passed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{check.name}</div>
                      <div className="text-[11px] text-slate-500">{check.description} • Details: {check.detail}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {check.passed ? 'PASS (+0)' : `FAIL (+${check.weight})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
