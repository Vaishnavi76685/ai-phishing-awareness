import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { QUIZ_QUESTIONS, INITIAL_STATS } from "./src/data/phishingData.js";
import { ScanResult, ThreatIndicator, RiskLevel, SystemLog } from "./src/types/phishing.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory runtime state (seeded with realistic data)
let dashboardData = { ...INITIAL_STATS };
let systemLogs: SystemLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 3600000).toISOString().replace("T", " ").substring(0, 19),
    action: "URL Threat Inspection",
    ipAddress: "192.168.1.45",
    details: "Scanned domain: secure-login-bankofamerica.com-account.xyz",
    riskLevel: "Phishing"
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 7200000).toISOString().replace("T", " ").substring(0, 19),
    action: "Email Content Analysis",
    ipAddress: "10.0.4.12",
    details: "Detected urgent account termination threat in email body",
    riskLevel: "Phishing"
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 10800000).toISOString().replace("T", " ").substring(0, 19),
    action: "URL Verification",
    ipAddress: "172.16.0.22",
    details: "Scanned GitHub official repository URL",
    riskLevel: "Safe"
  }
];

// Optional Gemini AI Lazy Init
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini AI client:", e);
    }
  }
  return aiClient;
}

// Gemini AI Deep URL Analysis Function
async function analyzeUrlWithGemini(url: string): Promise<ScanResult | null> {
  const gemini = getGeminiClient();
  if (!gemini) return null;

  try {
    const prompt = `You are a Senior Cyber Threat Intelligence Analyst.
Analyze the following URL for phishing, scam, malware, brand impersonation, or legitimacy:
"${url}"

Return a JSON object with:
- "classification": "Phishing" | "Suspicious" | "Safe"
- "riskScore": integer from 0 to 100
- "confidenceScore": integer from 60 to 99
- "indicators": array of objects with:
  - "type": "danger" | "warning" | "success" | "info"
  - "title": concise title
  - "description": clear detail about what was found specifically in this URL
  - "weight": integer risk weight (0 for success/info, 10-35 for warning/danger)
- "aiExplanation": 2-3 sentence technical analysis report explaining the findings specifically for "${url}".
- "preventionTips": array of 3 specific, practical security recommendations tailored directly to this input URL.
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            riskScore: { type: Type.INTEGER },
            confidenceScore: { type: Type.INTEGER },
            indicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight: { type: Type.INTEGER },
                },
                required: ["type", "title", "description", "weight"],
              },
            },
            aiExplanation: { type: Type.STRING },
            preventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["classification", "riskScore", "confidenceScore", "indicators", "aiExplanation", "preventionTips"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      const classification: RiskLevel = 
        parsed.classification === "Phishing" ? "Phishing" :
        parsed.classification === "Suspicious" ? "Suspicious" : "Safe";

      return {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        type: "url",
        target: url,
        classification,
        confidenceScore: parsed.confidenceScore || 92,
        riskScore: Math.min(100, Math.max(0, parsed.riskScore || 0)),
        indicators: parsed.indicators || [],
        aiExplanation: parsed.aiExplanation || "",
        preventionTips: parsed.preventionTips || [],
      };
    }
  } catch (err) {
    console.warn("Gemini URL scan failed, fallback to heuristic:", err);
  }
  return null;
}

// Gemini AI Deep Email Analysis Function
async function analyzeEmailWithGemini(content: string): Promise<ScanResult | null> {
  const gemini = getGeminiClient();
  if (!gemini) return null;

  try {
    const prompt = `You are an expert Cybersecurity Incident Responder.
Analyze the following email body or text for social engineering, spear phishing, credential harvesting, financial scams, or legitimacy:
"${content.substring(0, 2000)}"

Return a JSON object with:
- "classification": "Phishing" | "Suspicious" | "Safe"
- "riskScore": integer from 0 to 100
- "confidenceScore": integer from 60 to 99
- "indicators": array of objects with:
  - "type": "danger" | "warning" | "success" | "info"
  - "title": concise title
  - "description": specific detail about what was detected in this email content
  - "weight": integer risk weight
- "aiExplanation": 2-3 sentence technical analysis explaining the classification and findings specifically for this email text.
- "preventionTips": array of 3 specific, practical security recommendations tailored directly to this email text.
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            riskScore: { type: Type.INTEGER },
            confidenceScore: { type: Type.INTEGER },
            indicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight: { type: Type.INTEGER },
                },
                required: ["type", "title", "description", "weight"],
              },
            },
            aiExplanation: { type: Type.STRING },
            preventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["classification", "riskScore", "confidenceScore", "indicators", "aiExplanation", "preventionTips"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      const classification: RiskLevel = 
        parsed.classification === "Phishing" ? "Phishing" :
        parsed.classification === "Suspicious" ? "Suspicious" : "Safe";

      return {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        type: "email",
        target: content.length > 80 ? content.substring(0, 80) + "..." : content,
        classification,
        confidenceScore: parsed.confidenceScore || 90,
        riskScore: Math.min(100, Math.max(0, parsed.riskScore || 0)),
        indicators: parsed.indicators || [],
        aiExplanation: parsed.aiExplanation || "",
        preventionTips: parsed.preventionTips || [],
      };
    }
  } catch (err) {
    console.warn("Gemini email scan failed, fallback to heuristic:", err);
  }
  return null;
}

// Fallback Dynamic Heuristic URL Analyzer
function evaluateUrlHeuristics(url: string): { 
  riskScore: number; 
  confidenceScore: number;
  indicators: ThreatIndicator[]; 
  classification: RiskLevel;
  aiExplanation: string;
  preventionTips: string[];
} {
  const indicators: ThreatIndicator[] = [];
  let riskScore = 0;

  const rawUrl = url.trim();
  const lower = rawUrl.toLowerCase();

  let hostname = '';
  try {
    const parsed = new URL(lower.startsWith('http') ? lower : `http://${lower}`);
    hostname = parsed.hostname;
  } catch (e) {
    hostname = lower.replace(/^https?:\/\//, '').split('/')[0];
  }

  // Known safe major root domains
  const knownSafeDomains = [
    'google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com',
    'wikipedia.org', 'youtube.com', 'linkedin.com', 'twitter.com', 'x.com', 'facebook.com',
    'instagram.com', 'openai.com', 'cloudflare.com', 'stackoverflow.com', 'reddit.com',
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'netflix.com'
  ];

  const isExactSafeDomain = knownSafeDomains.some(d => hostname === d || hostname.endsWith('.' + d));

  // 1. IP Address check
  const ipMatch = lower.match(/https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/);
  if (ipMatch) {
    indicators.push({
      type: "danger",
      title: "Raw IP Address Hostname",
      description: `Host is specified as a raw IP address (${hostname}) rather than a registered domain name.`,
      weight: 35
    });
    riskScore += 35;
  }

  // 2. Length check
  if (rawUrl.length > 75) {
    indicators.push({
      type: "warning",
      title: "Excessive URL Length (>75 chars)",
      description: `URL contains ${rawUrl.length} characters, which is often used to obfuscate redirection paths.`,
      weight: 15
    });
    riskScore += 15;
  }

  // 3. Subdomains check
  const domainParts = hostname.split('.');
  if (domainParts.length > 3 && !isExactSafeDomain) {
    indicators.push({
      type: "warning",
      title: "Excessive Subdomain Depth",
      description: `Hostname '${hostname}' contains ${domainParts.length - 2} nested subdomain levels.`,
      weight: 20
    });
    riskScore += 20;
  }

  // 4. High-risk TLDs
  const suspiciousTlds = [".xyz", ".top", ".tk", ".zip", ".click", ".gq", ".cf", ".ml", ".work", ".site", ".online"];
  const matchedTld = suspiciousTlds.find(tld => hostname.endsWith(tld));
  if (matchedTld) {
    indicators.push({
      type: "danger",
      title: `High-Risk TLD (${matchedTld})`,
      description: `Top-Level Domain '${matchedTld}' is statistically over-represented in automated phishing toolkits.`,
      weight: 25
    });
    riskScore += 25;
  }

  // 5. Special character '@'
  if (rawUrl.includes("@")) {
    indicators.push({
      type: "danger",
      title: "@ Symbol in URL Authority",
      description: "URL uses '@' notation to mislead users about the true destination host.",
      weight: 30
    });
    riskScore += 30;
  }

  // 6. URL Shorteners
  const shorteners = ["bit.ly", "tinyurl.com", "is.gd", "goo.gl", "t.co", "cutt.ly", "ow.ly"];
  const matchedShortener = shorteners.find(s => lower.includes(s));
  if (matchedShortener) {
    indicators.push({
      type: "warning",
      title: `URL Shortener Proxy (${matchedShortener})`,
      description: `Link is masked using ${matchedShortener}, obscuring the true final destination.`,
      weight: 20
    });
    riskScore += 20;
  }

  // 7. HTTPS check
  if (!lower.startsWith("https://")) {
    indicators.push({
      type: "info",
      title: "Unencrypted Connection (HTTP)",
      description: "URL lacks TLS/SSL encryption, exposing data to potential MITM interception.",
      weight: 10
    });
    riskScore += 10;
  }

  // 8. Brand Impersonation / Typosquatting Keywords
  const brandKeywords = ["paypal", "bankofamerica", "chase", "microsoft", "apple", "google", "wellsfargo", "netflix", "amazon", "login", "verify", "secure", "update", "account"];
  const matchedBrands = brandKeywords.filter(b => lower.includes(b));
  
  if (!isExactSafeDomain && matchedBrands.length >= 1) {
    if (matchedBrands.length > 1 || matchedTld || ipMatch) {
      indicators.push({
        type: "danger",
        title: "Brand Keyword Impersonation",
        description: `Unverified domain contains sensitive brand terms [${matchedBrands.join(", ")}], common in fake login portals.`,
        weight: 35
      });
      riskScore += 35;
    } else {
      indicators.push({
        type: "warning",
        title: "Authentication Keyword Present",
        description: `URL contains keyword '${matchedBrands[0]}' on domain '${hostname}'. Verify authenticity.`,
        weight: 15
      });
      riskScore += 15;
    }
  }

  // If exact known safe domain and no dangerous flags
  if (isExactSafeDomain && !ipMatch && !matchedTld && !rawUrl.includes("@")) {
    riskScore = 0;
    indicators.length = 0; // reset
    indicators.push({
      type: "success",
      title: "Verified Legitimate Domain",
      description: `Hostname '${hostname}' matches an established official web domain.`,
      weight: 0
    });
    if (lower.startsWith("https://")) {
      indicators.push({
        type: "success",
        title: "Enforced TLS Encryption",
        description: "Valid HTTPS connection detected.",
        weight: 0
      });
    }
  } else if (indicators.length === 0) {
    indicators.push({
      type: "success",
      title: "Clean Structural Profile",
      description: `Domain '${hostname}' shows standard URL formatting without common phishing flags.`,
      weight: 0
    });
  }

  let classification: RiskLevel = "Safe";
  if (riskScore >= 45) {
    classification = "Phishing";
  } else if (riskScore >= 18) {
    classification = "Suspicious";
  }

  const confidenceScore = isExactSafeDomain ? 98 : Math.min(96, Math.max(72, 60 + riskScore / 3));

  let aiExplanation = "";
  if (classification === "Phishing") {
    aiExplanation = `Security Threat Analysis: The inspected link "${hostname}" exhibits ${indicators.length} critical risk factors (Score: ${riskScore}/100), including suspicious structural patterns and brand keyword anomalies. High likelihood of credential harvesting or redirect trap.`;
  } else if (classification === "Suspicious") {
    aiExplanation = `Heuristic Advisory: Target URL "${hostname}" has moderate risk indicators (Score: ${riskScore}/100). Caution is advised before entering passwords or downloading attachments.`;
  } else {
    aiExplanation = `Verification Report: Target domain "${hostname}" passed structural heuristic checks (Risk Score: ${riskScore}/100). The domain appears clean and aligns with standard web guidelines.`;
  }

  const preventionTips = [
    `Always verify the domain in your browser address bar reads exactly '${hostname}' before typing credentials.`,
    classification === "Phishing"
      ? `Do NOT enter passwords or multi-factor tokens on ${hostname}.`
      : `Look for the padlock icon in your browser to confirm SSL encryption.`,
    `Use a password manager, which automatically refuses to auto-fill credentials on fake domains.`
  ];

  return { riskScore: Math.min(100, riskScore), confidenceScore: Math.round(confidenceScore), indicators, classification, aiExplanation, preventionTips };
}

// Fallback Dynamic Heuristic Email Analyzer
function evaluateEmailHeuristics(content: string): { 
  riskScore: number; 
  confidenceScore: number;
  indicators: ThreatIndicator[]; 
  classification: RiskLevel;
  aiExplanation: string;
  preventionTips: string[];
} {
  const indicators: ThreatIndicator[] = [];
  let riskScore = 0;
  const lower = content.toLowerCase();

  // 1. Urgency / Threat language
  const urgencyWords = ["urgent", "immediately", "24 hours", "suspended", "account terminated", "action required", "legal action", "final notice", "unauthorized access", "expiring today"];
  const matchedUrgency = urgencyWords.filter(w => lower.includes(w));
  if (matchedUrgency.length > 0) {
    indicators.push({
      type: "danger",
      title: "Urgency & Coercive Pressure",
      description: `High-pressure terms detected: [${matchedUrgency.slice(0, 3).join(", ")}]. Designed to rush recipient into action.`,
      weight: 30
    });
    riskScore += 30;
  }

  // 2. Credential harvesting triggers
  const credWords = ["password", "verify credentials", "ssn", "social security", "pin", "login now", "bank details", "confirm account", "update billing"];
  const matchedCreds = credWords.filter(w => lower.includes(w));
  if (matchedCreds.length > 0) {
    indicators.push({
      type: "danger",
      title: "Credential Harvesting Language",
      description: `Prompts for sensitive account credentials or identity data: [${matchedCreds.slice(0, 3).join(", ")}].`,
      weight: 35
    });
    riskScore += 35;
  }

  // 3. Financial / Wire Transfer / Gift Cards
  const moneyWords = ["wire transfer", "gift card", "apple card", "bitcoin", "crypto payment", "invoice overdue", "payment required", "direct deposit"];
  const matchedMoney = moneyWords.filter(w => lower.includes(w));
  if (matchedMoney.length > 0) {
    indicators.push({
      type: "warning",
      title: "Unsolicited Financial / Payment Prompt",
      description: `Requests financial transfer or untraceable payment methods: [${matchedMoney.slice(0, 3).join(", ")}].`,
      weight: 25
    });
    riskScore += 25;
  }

  // 4. Generic Salutations
  const genericGreetings = ["dear customer", "dear user", "valued account holder", "dear account owner", "dear employee"];
  const matchedGreetings = genericGreetings.filter(g => lower.includes(g));
  if (matchedGreetings.length > 0) {
    indicators.push({
      type: "warning",
      title: "Generic Non-Personalized Greeting",
      description: `Uses broadcast salutation ('${matchedGreetings[0]}') instead of your actual name.`,
      weight: 15
    });
    riskScore += 15;
  }

  // 5. Embedded Links count
  const linkMatches = content.match(/https?:\/\/\S+/g) || [];
  if (linkMatches.length > 0) {
    indicators.push({
      type: "info",
      title: `Embedded External Hyperlinks (${linkMatches.length})`,
      description: `Email body contains ${linkMatches.length} external URL links. Inspect destination hostnames carefully.`,
      weight: 10
    });
    riskScore += 10;
  }

  if (indicators.length === 0) {
    indicators.push({
      type: "success",
      title: "Standard Email Structure",
      description: "No high-pressure urgency keywords, credential prompts, or financial traps detected.",
      weight: 0
    });
  }

  let classification: RiskLevel = "Safe";
  if (riskScore >= 45) {
    classification = "Phishing";
  } else if (riskScore >= 18) {
    classification = "Suspicious";
  }

  const confidenceScore = Math.min(95, Math.max(70, 65 + riskScore / 3));

  let aiExplanation = "";
  if (classification === "Phishing") {
    aiExplanation = `Email Threat Analysis: The submitted text contains ${indicators.length} social engineering indicators (Risk Score: ${riskScore}/100), including pressure tactics and credential capture prompts. High probability of phishing fraud.`;
  } else if (classification === "Suspicious") {
    aiExplanation = `Email Content Advisory: Text evaluated with a risk score of ${riskScore}/100. Contains trigger terms that warrant extra sender verification before clicking any links.`;
  } else {
    aiExplanation = `Email Verification Report: Content passed heuristic screening with low risk score (${riskScore}/100). No coercive phishing language or credential prompts identified.`;
  }

  const preventionTips = [
    `Verify the sender's full email address and domain header, not just the display name.`,
    `Do not click embedded links in urgent messages; navigate directly to official websites.`,
    `Cross-check unexpected financial or access requests with your organization's IT department.`
  ];

  return { riskScore: Math.min(100, riskScore), confidenceScore: Math.round(confidenceScore), indicators, classification, aiExplanation, preventionTips };
}

// REST API ROUTES

// 1. URL Scan
app.post("/api/scan/url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL string is required" });
    }

    // Try Gemini first if key available
    const geminiResult = await analyzeUrlWithGemini(url);
    if (geminiResult) {
      dashboardData.totalScans += 1;
      if (geminiResult.classification === "Safe") dashboardData.safeScans += 1;
      if (geminiResult.classification === "Suspicious") dashboardData.suspiciousScans += 1;
      if (geminiResult.classification === "Phishing") dashboardData.phishingScans += 1;
      dashboardData.recentScans.unshift(geminiResult);
      if (dashboardData.recentScans.length > 20) dashboardData.recentScans.pop();

      systemLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: geminiResult.timestamp,
        action: "URL Scan (AI Powered)",
        ipAddress: "127.0.0.1",
        details: `Scanned target URL: ${url.substring(0, 60)}`,
        riskLevel: geminiResult.classification
      });

      return res.json(geminiResult);
    }

    // Fallback heuristic if Gemini unavailable
    const heuristic = evaluateUrlHeuristics(url);

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "url",
      target: url,
      classification: heuristic.classification,
      confidenceScore: heuristic.confidenceScore,
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation: heuristic.aiExplanation,
      preventionTips: heuristic.preventionTips
    };

    dashboardData.totalScans += 1;
    if (heuristic.classification === "Safe") dashboardData.safeScans += 1;
    if (heuristic.classification === "Suspicious") dashboardData.suspiciousScans += 1;
    if (heuristic.classification === "Phishing") dashboardData.phishingScans += 1;
    dashboardData.recentScans.unshift(result);
    if (dashboardData.recentScans.length > 20) dashboardData.recentScans.pop();

    systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: result.timestamp,
      action: "URL Scan",
      ipAddress: "127.0.0.1",
      details: `Scanned target URL: ${url.substring(0, 60)}`,
      riskLevel: heuristic.classification
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to scan URL" });
  }
});

// 2. Email Scan
app.post("/api/scan/email", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Email content is required" });
    }

    // Try Gemini first if key available
    const geminiResult = await analyzeEmailWithGemini(content);
    if (geminiResult) {
      dashboardData.totalScans += 1;
      if (geminiResult.classification === "Safe") dashboardData.safeScans += 1;
      if (geminiResult.classification === "Suspicious") dashboardData.suspiciousScans += 1;
      if (geminiResult.classification === "Phishing") dashboardData.phishingScans += 1;
      dashboardData.recentScans.unshift(geminiResult);
      if (dashboardData.recentScans.length > 20) dashboardData.recentScans.pop();

      systemLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: geminiResult.timestamp,
        action: "Email Scan (AI Powered)",
        ipAddress: "127.0.0.1",
        details: `Scanned email text (${content.length} characters)`,
        riskLevel: geminiResult.classification
      });

      return res.json(geminiResult);
    }

    // Fallback heuristic if Gemini unavailable
    const heuristic = evaluateEmailHeuristics(content);

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "email",
      target: content.length > 80 ? content.substring(0, 80) + "..." : content,
      classification: heuristic.classification,
      confidenceScore: heuristic.confidenceScore,
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation: heuristic.aiExplanation,
      preventionTips: heuristic.preventionTips
    };

    dashboardData.totalScans += 1;
    if (heuristic.classification === "Safe") dashboardData.safeScans += 1;
    if (heuristic.classification === "Suspicious") dashboardData.suspiciousScans += 1;
    if (heuristic.classification === "Phishing") dashboardData.phishingScans += 1;
    dashboardData.recentScans.unshift(result);
    if (dashboardData.recentScans.length > 20) dashboardData.recentScans.pop();

    systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: result.timestamp,
      action: "Email Content Scan",
      ipAddress: "127.0.0.1",
      details: `Scanned email content (${content.length} characters)`,
      riskLevel: heuristic.classification
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to scan email" });
  }
});

// 3. File Scan
app.post("/api/scan/file", async (req, res) => {
  try {
    const { filename, fileContent } = req.body;
    if (!fileContent) {
      return res.status(400).json({ error: "File content is required" });
    }

    const isUrl = fileContent.trim().startsWith("http://") || fileContent.trim().startsWith("https://");
    
    if (isUrl) {
      const geminiResult = await analyzeUrlWithGemini(fileContent.trim());
      if (geminiResult) {
        geminiResult.type = "file";
        geminiResult.target = filename || "uploaded_file.txt";
        
        dashboardData.totalScans += 1;
        if (geminiResult.classification === "Safe") dashboardData.safeScans += 1;
        if (geminiResult.classification === "Suspicious") dashboardData.suspiciousScans += 1;
        if (geminiResult.classification === "Phishing") dashboardData.phishingScans += 1;
        dashboardData.recentScans.unshift(geminiResult);
        return res.json(geminiResult);
      }
    } else {
      const geminiResult = await analyzeEmailWithGemini(fileContent);
      if (geminiResult) {
        geminiResult.type = "file";
        geminiResult.target = filename || "uploaded_file.txt";
        
        dashboardData.totalScans += 1;
        if (geminiResult.classification === "Safe") dashboardData.safeScans += 1;
        if (geminiResult.classification === "Suspicious") dashboardData.suspiciousScans += 1;
        if (geminiResult.classification === "Phishing") dashboardData.phishingScans += 1;
        dashboardData.recentScans.unshift(geminiResult);
        return res.json(geminiResult);
      }
    }

    const heuristic = isUrl ? evaluateUrlHeuristics(fileContent.trim()) : evaluateEmailHeuristics(fileContent);

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "file",
      target: filename || "uploaded_file.txt",
      classification: heuristic.classification,
      confidenceScore: heuristic.confidenceScore,
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation: heuristic.aiExplanation,
      preventionTips: heuristic.preventionTips
    };

    dashboardData.totalScans += 1;
    if (heuristic.classification === "Safe") dashboardData.safeScans += 1;
    if (heuristic.classification === "Suspicious") dashboardData.suspiciousScans += 1;
    if (heuristic.classification === "Phishing") dashboardData.phishingScans += 1;
    dashboardData.recentScans.unshift(result);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to scan uploaded file" });
  }
});

// 4. Dashboard Stats API
app.get("/api/dashboard/stats", (req, res) => {
  dashboardData.threatDistribution = [
    { name: "Safe Content", value: dashboardData.safeScans, color: "#10B981" },
    { name: "Suspicious Anomalies", value: dashboardData.suspiciousScans, color: "#F59E0B" },
    { name: "High-Risk Phishing", value: dashboardData.phishingScans, color: "#EF4444" }
  ];
  res.json(dashboardData);
});

// 5. Quiz Questions API
app.get("/api/quiz", (req, res) => {
  res.json({ questions: QUIZ_QUESTIONS });
});

// 6. Submit Quiz API
app.post("/api/quiz/submit", (req, res) => {
  const { userAnswers } = req.body;
  if (!userAnswers || typeof userAnswers !== "object") {
    return res.status(400).json({ error: "Invalid user answers object" });
  }

  let correctCount = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount += 1;
    }
  });

  const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  res.json({
    totalQuestions: QUIZ_QUESTIONS.length,
    correctCount,
    percentage,
    passed: percentage >= 70,
    badge: percentage >= 90 ? "Cyber Security Expert" : percentage >= 70 ? "Awareness Practitioner" : "Needs Review"
  });
});

// 7. Admin Login API
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === "admin123" || password === "admin") {
    return res.json({ success: true, token: "admin-session-authenticated-key" });
  }
  res.status(401).json({ success: false, error: "Invalid admin password (default is 'admin123')" });
});

// 8. Admin Logs API
app.get("/api/admin/logs", (req, res) => {
  res.json({ logs: systemLogs });
});

// 9. Python Standalone Code Export Center
app.get("/api/export/python-files", (req, res) => {
  res.json({
    files: [
      { name: "app.py", path: "python_project/app.py" },
      { name: "train_model.py", path: "python_project/train_model.py" },
      { name: "predict.py", path: "python_project/predict.py" },
      { name: "requirements.txt", path: "python_project/requirements.txt" },
      { name: "Procfile", path: "python_project/Procfile" },
      { name: "README.md", path: "python_project/README.md" },
      { name: "phishing_dataset.csv", path: "python_project/dataset/phishing_dataset.csv" }
    ]
  });
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Phishing Awareness & Detection System running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
