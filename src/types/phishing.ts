export type RiskLevel = 'Safe' | 'Suspicious' | 'Phishing';

export interface ThreatIndicator {
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  weight: number;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  type: 'url' | 'email' | 'file';
  target: string;
  classification: RiskLevel;
  confidenceScore: number; // 0 to 100
  riskScore: number; // 0 to 100
  indicators: ThreatIndicator[];
  aiExplanation: string;
  preventionTips: string[];
  extractedFeatures?: Record<string, boolean | number | string>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  category: 'Email Phishing' | 'URL Fraud' | 'Spear Phishing' | 'MFA & Credentials' | 'Smishing & Vishing' | 'Social Engineering';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<number, number>;
}

export interface DashboardStats {
  totalScans: number;
  safeScans: number;
  suspiciousScans: number;
  phishingScans: number;
  avgRiskScore: number;
  scanTrends: Array<{ date: string; safe: number; suspicious: number; phishing: number }>;
  threatDistribution: Array<{ name: string; value: number; color: string }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  recentScans: ScanResult[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  ipAddress: string;
  details: string;
  riskLevel: RiskLevel;
}
