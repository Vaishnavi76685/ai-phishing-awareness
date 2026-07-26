import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
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
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize Gemini AI client:", e);
    }
  }
  return aiClient;
}

// Heuristic URL Analyzer
function evaluateUrlHeuristics(url: string): { riskScore: number; indicators: ThreatIndicator[]; classification: RiskLevel } {
  const indicators: ThreatIndicator[] = [];
  let riskScore = 0;

  const lower = url.toLowerCase();

  // 1. IP Address check
  const ipMatch = lower.match(/https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/);
  if (ipMatch) {
    indicators.push({
      type: "danger",
      title: "Raw IP Address Hostname",
      description: "Host is specified as a raw IP address rather than a verified domain name.",
      weight: 35
    });
    riskScore += 35;
  }

  // 2. Length check
  if (url.length > 75) {
    indicators.push({
      type: "warning",
      title: "Excessive URL Length (>75 chars)",
      description: "Extremely long URLs are commonly used to obscure malicious query strings.",
      weight: 15
    });
    riskScore += 15;
  }

  // 3. Subdomains check
  try {
    const hostname = new URL(url.startsWith("http") ? url : `http://${url}`).hostname;
    const parts = hostname.split(".");
    if (parts.length > 3) {
      indicators.push({
        type: "warning",
        title: "Excessive Subdomain Depth",
        description: `Hostname contains ${parts.length - 2} subdomain levels, often used in typosquatting.`,
        weight: 20
      });
      riskScore += 20;
    }
  } catch (e) {
    // Malformed URL
  }

  // 4. High-risk TLDs
  const suspiciousTlds = [".xyz", ".top", ".tk", ".zip", ".click", ".gq", ".cf", ".ml", ".work"];
  if (suspiciousTlds.some(tld => lower.includes(tld))) {
    indicators.push({
      type: "danger",
      title: "High-Risk TLD Detected",
      description: "Top-Level Domain frequently associated with spam and phishing campaigns.",
      weight: 25
    });
    riskScore += 25;
  }

  // 5. Special character '@'
  if (url.includes("@")) {
    indicators.push({
      type: "danger",
      title: "@ Symbol in URL Authority",
      description: "Browsers ignore text before @ symbol, misleading users regarding true destination.",
      weight: 30
    });
    riskScore += 30;
  }

  // 6. URL Shorteners
  const shorteners = ["bit.ly", "tinyurl.com", "is.gd", "goo.gl", "t.co", "cutt.ly", "ow.ly"];
  if (shorteners.some(s => lower.includes(s))) {
    indicators.push({
      type: "warning",
      title: "URL Shortening Service",
      description: "Destination URL is masked behind a shortening proxy service.",
      weight: 20
    });
    riskScore += 20;
  }

  // 7. HTTPS check
  if (!lower.startsWith("https://")) {
    indicators.push({
      type: "info",
      title: "Unencrypted Connection (HTTP)",
      description: "Connection does not enforce transport layer SSL/TLS security.",
      weight: 10
    });
    riskScore += 10;
  }

  // 8. Brand Impersonation Keywords
  const brandKeywords = ["paypal", "bankofamerica", "chase", "microsoft", "apple", "google", "wellsfargo", "netflix", "amazon", "login", "verify", "secure", "update"];
  const matchedBrands = brandKeywords.filter(b => lower.includes(b));
  if (matchedBrands.length > 1) {
    indicators.push({
      type: "danger",
      title: "Brand Keyword Stacking",
      description: `Contains sensitive terms: [${matchedBrands.join(", ")}]. Common in fake credential portals.`,
      weight: 30
    });
    riskScore += 30;
  }

  if (indicators.length === 0) {
    indicators.push({
      type: "success",
      title: "No Anomaly Detected",
      description: "URL structural pattern matches standard web standards.",
      weight: 0
    });
  }

  let classification: RiskLevel = "Safe";
  if (riskScore >= 45) {
    classification = "Phishing";
  } else if (riskScore >= 18) {
    classification = "Suspicious";
  }

  return { riskScore: Math.min(100, riskScore), indicators, classification };
}

// Heuristic Email Analyzer
function evaluateEmailHeuristics(content: string): { riskScore: number; indicators: ThreatIndicator[]; classification: RiskLevel } {
  const indicators: ThreatIndicator[] = [];
  let riskScore = 0;
  const lower = content.toLowerCase();

  // 1. Urgency / Threat language
  const urgencyWords = ["urgent", "immediately", "24 hours", "suspended", "account terminated", "action required", "legal action", "final notice"];
  const matchedUrgency = urgencyWords.filter(w => lower.includes(w));
  if (matchedUrgency.length > 0) {
    indicators.push({
      type: "danger",
      title: "High Urgency & Fear Triggers",
      description: `Coercive terms detected: [${matchedUrgency.join(", ")}]. Designed to provoke panic.`,
      weight: 30
    });
    riskScore += 30;
  }

  // 2. Credential harvesting triggers
  const credWords = ["password", "verify credentials", "ssn", "social security", "pin", "login now", "bank details", "confirm your account"];
  const matchedCreds = credWords.filter(w => lower.includes(w));
  if (matchedCreds.length > 0) {
    indicators.push({
      type: "danger",
      title: "Credential Request Keywords",
      description: `Requests sensitive credentials or personal data: [${matchedCreds.join(", ")}].`,
      weight: 35
    });
    riskScore += 35;
  }

  // 3. Financial / Wire Transfer / Gift Cards
  const moneyWords = ["wire transfer", "gift card", "apple card", "bitcoin", "crypto payment", "invoice overdue", "payment required"];
  const matchedMoney = moneyWords.filter(w => lower.includes(w));
  if (matchedMoney.length > 0) {
    indicators.push({
      type: "warning",
      title: "Unsolicited Financial Action",
      description: `Requests direct payment or untraceable funds: [${matchedMoney.join(", ")}].`,
      weight: 25
    });
    riskScore += 25;
  }

  // 4. Generic Salutations
  const genericGreetings = ["dear customer", "dear user", "valued account holder", "dear account owner"];
  if (genericGreetings.some(g => lower.includes(g))) {
    indicators.push({
      type: "warning",
      title: "Generic Non-Personalized Salutation",
      description: "Uses mass broadcast greeting rather than addressing user by true recipient name.",
      weight: 15
    });
    riskScore += 15;
  }

  // 5. Embedded Links count
  const linkMatches = content.match(/https?:\/\/\S+/g) || [];
  if (linkMatches.length > 0) {
    indicators.push({
      type: "info",
      title: `Embedded Hyperlinks Detected (${linkMatches.length})`,
      description: "Email contains external hyperlinks requiring destination validation.",
      weight: 10
    });
    riskScore += 10;
  }

  if (indicators.length === 0) {
    indicators.push({
      type: "success",
      title: "Standard Email Structure",
      description: "No common phishing trigger phrases or coercion patterns detected.",
      weight: 0
    });
  }

  let classification: RiskLevel = "Safe";
  if (riskScore >= 45) {
    classification = "Phishing";
  } else if (riskScore >= 18) {
    classification = "Suspicious";
  }

  return { riskScore: Math.min(100, riskScore), indicators, classification };
}

// REST API ROUTES

// 1. URL Scan
app.post("/api/scan/url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL string is required" });
    }

    const heuristic = evaluateUrlHeuristics(url);
    let aiExplanation = `Rule Engine Analysis: Target URL evaluated with risk score ${heuristic.riskScore}/100 based on structural indicators.`;
    
    // Optional Gemini AI deep analysis if key is available
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are a Senior Cybersecurity Threat Analyst. Analyze the following URL for potential phishing or malicious indicators: "${url}".
Provide a concise 2-3 sentence threat analysis report explaining why this URL is ${heuristic.classification} and key advice for security analysts.`
        });
        if (response.text) {
          aiExplanation = response.text.trim();
        }
      } catch (e) {
        console.warn("Gemini call failed, falling back to heuristic explanation:", e);
      }
    }

    const preventionTips = [
      "Check the address bar to ensure the domain name exactly matches the official vendor.",
      "Never enter passwords on links received via unsolicited messages.",
      "Enable multi-factor authentication (MFA) using security keys or authenticator apps."
    ];

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "url",
      target: url,
      classification: heuristic.classification,
      confidenceScore: Math.min(99, Math.max(65, 50 + heuristic.riskScore / 2)),
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation,
      preventionTips
    };

    // Update Dashboard Stats
    dashboardData.totalScans += 1;
    if (heuristic.classification === "Safe") dashboardData.safeScans += 1;
    if (heuristic.classification === "Suspicious") dashboardData.suspiciousScans += 1;
    if (heuristic.classification === "Phishing") dashboardData.phishingScans += 1;
    dashboardData.recentScans.unshift(result);
    if (dashboardData.recentScans.length > 20) dashboardData.recentScans.pop();

    // Log action
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

    const heuristic = evaluateEmailHeuristics(content);
    let aiExplanation = `Natural Language Heuristic Engine: Analyzed text content with risk score ${heuristic.riskScore}/100.`;

    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are an expert Cyber Security Incident Responder. Evaluate the following email text for social engineering, spear phishing, or fraud triggers:
"${content.substring(0, 1000)}"
Give a clear 2-3 sentence technical breakdown explaining why it is classified as ${heuristic.classification}.`
        });
        if (response.text) {
          aiExplanation = response.text.trim();
        }
      } catch (e) {
        console.warn("Gemini call failed:", e);
      }
    }

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "email",
      target: content.length > 80 ? content.substring(0, 80) + "..." : content,
      classification: heuristic.classification,
      confidenceScore: Math.min(99, Math.max(68, 55 + heuristic.riskScore / 2)),
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation,
      preventionTips: [
        "Verify sender email domain headers for spoofing anomalies.",
        "Cross-check suspicious financial requests with colleagues via phone or internal chat.",
        "Do not click links inside high-urgency notifications."
      ]
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
    const heuristic = isUrl ? evaluateUrlHeuristics(fileContent.trim()) : evaluateEmailHeuristics(fileContent);

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "file",
      target: filename || "uploaded_file.txt",
      classification: heuristic.classification,
      confidenceScore: Math.min(99, Math.max(70, 55 + heuristic.riskScore / 2)),
      riskScore: heuristic.riskScore,
      indicators: heuristic.indicators,
      aiExplanation: `Text File Analyzer scanned "${filename || 'file.txt'}". Classification: ${heuristic.classification} (Risk Score: ${heuristic.riskScore}/100).`,
      preventionTips: [
        "Scan attachments for malicious macro code and executable scripts.",
        "Ensure file extensions match the expected MIME format."
      ]
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
