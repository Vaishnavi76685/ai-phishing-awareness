import { QuizQuestion, ScanResult } from '../types/phishing';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Email Phishing',
    difficulty: 'Easy',
    question: 'You receive an email from "service@paypaI.com" (with a capital I) stating your account is locked and asking you to click a link to verify your password. What is the biggest red flag?',
    scenario: 'Email Sender: service@paypaI.com | Subject: URGENT: Account Locked',
    options: [
      'The email was received on a weekday',
      'Typosquatting/homograph domain name spoofing using capital "I" instead of "l"',
      'The email uses professional formatting',
      'The company logo is present in the email header'
    ],
    correctAnswer: 1,
    explanation: 'Attackers frequently use typosquatting or homograph tricks (e.g. replacing lowercase "l" with capital "I" or unicode characters) to impersonate trusted domains like PayPal.'
  },
  {
    id: 2,
    category: 'URL Fraud',
    difficulty: 'Easy',
    question: 'Which of the following URLs is MOST likely a malicious phishing domain?',
    scenario: 'Checking links before entering credentials',
    options: [
      'https://www.chase.com/personal/banking',
      'http://192.168.1.100/chase-online-login/verify.html',
      'https://accounts.chase.com/login',
      'https://support.chase.com/contact'
    ],
    correctAnswer: 1,
    explanation: 'Legitimate financial institutions NEVER ask users to log into raw IP addresses over unencrypted HTTP protocol. Raw IPs in hostnames are a high-severity phishing marker.'
  },
  {
    id: 3,
    category: 'Spear Phishing',
    difficulty: 'Medium',
    question: 'An email arrives from your company CEO asking you to urgently purchase $500 in Apple gift cards for a client meeting. The email says: "I am in a meeting, do not call me, just reply with card codes." What type of attack is this?',
    scenario: 'Executive Request for Gift Cards via Email',
    options: [
      'Ransomware campaign',
      'CEO Fraud / Business Email Compromise (BEC)',
      'Man-in-the-Middle attack',
      'Distributed Denial of Service (DDoS)'
    ],
    correctAnswer: 1,
    explanation: 'BEC / CEO Fraud relies on urgency and authority to trick employees into bypassing standard financial controls (e.g., buying gift cards or authorizing wire transfers).'
  },
  {
    id: 4,
    category: 'MFA & Credentials',
    difficulty: 'Medium',
    question: 'You suddenly receive 15 consecutive Multi-Factor Authentication (MFA) push prompts on your phone late at night, followed by a text message saying "Microsoft Support: Press Approve to stop security spam." What should you do?',
    scenario: 'MFA Push Fatigue / MFA Bombing Attack',
    options: [
      'Press Approve so the notifications stop ringing',
      'Deny all prompts, do NOT approve, and immediately report the incident to your IT security team',
      'Reply to the text message with your password',
      'Turn off your phone and ignore it until next week'
    ],
    correctAnswer: 1,
    explanation: 'This is an "MFA Fatigue" or "MFA Prompt Bombing" attack. Attackers spam approval requests hoping the victim will accidentally or out of frustration tap "Approve". Never approve unsolicited MFA prompts!'
  },
  {
    id: 5,
    category: 'URL Fraud',
    difficulty: 'Hard',
    question: 'Analyze this link: "https://login.microsoft.com.attackerdomain.xyz/auth/login". Which domain actually controls this website?',
    scenario: 'URL Subdomain Obfuscation',
    options: [
      'microsoft.com',
      'login.microsoft.com',
      'attackerdomain.xyz',
      'auth/login'
    ],
    correctAnswer: 2,
    explanation: 'In URL structure, the actual domain is always the portion immediately preceding the Top Level Domain (.xyz) and path. "login.microsoft.com" is merely a crafted subdomain hosted on "attackerdomain.xyz".'
  },
  {
    id: 6,
    category: 'Smishing & Vishing',
    difficulty: 'Easy',
    question: 'What is "Smishing"?',
    scenario: 'SMS-based Security Threat',
    options: [
      'Phishing conducted over SMS / Text Messages',
      'Phishing using encrypted email servers',
      'Malware transmitted over satellite radio',
      'Phishing targeting smart TVs'
    ],
    correctAnswer: 0,
    explanation: 'Smishing combines "SMS" and "Phishing". Attackers send text messages containing malicious links (e.g., fake package delivery updates or bank alerts).'
  },
  {
    id: 7,
    category: 'Social Engineering',
    difficulty: 'Medium',
    question: 'An IT contractor visits your office, wears a fake badge, and walks right behind an employee through a secure badge-access door. What social engineering tactic was used?',
    scenario: 'Physical Security Control Bypass',
    options: [
      'Baiting',
      'Tailgating / Piggybacking',
      'Pretexting',
      'Watering Hole Attack'
    ],
    correctAnswer: 1,
    explanation: 'Tailgating (or piggybacking) occurs when an unauthorized person physically follows an authorized employee into a restricted area without scanning their credentials.'
  },
  {
    id: 8,
    category: 'Email Phishing',
    difficulty: 'Easy',
    question: 'Which greeting in an email claiming to be from your primary bank is most suspicious?',
    scenario: 'Email Salutation Inspection',
    options: [
      'Dear Alex Smith,',
      'Dear Customer / Valued Account Holder,',
      'Hi Alex,',
      'Good morning Alex,'
    ],
    correctAnswer: 1,
    explanation: 'Mass phishing campaigns send generic emails to millions of recipients without personalized names, using generic greetings like "Dear Valued Customer".'
  },
  {
    id: 9,
    category: 'MFA & Credentials',
    difficulty: 'Hard',
    question: 'What is "OAuth Consent Phishing" (Illicit Consent Grant)?',
    scenario: 'Third-Party App Permissions Abuse',
    options: [
      'Stealing Wi-Fi passwords with a rouge access point',
      'Tricking a user into authorizing a malicious third-party OAuth app to access their cloud inbox/files without giving away their password',
      'Sending fake physical mail to a corporation',
      'Brute-forcing an SSH server port 22'
    ],
    correctAnswer: 1,
    explanation: 'Consent phishing trick users into clicking "Accept" on cloud permissions prompts (e.g. Microsoft 365 or Google Workspace), granting attackers token access to emails and files even with 2FA enabled.'
  },
  {
    id: 10,
    category: 'URL Fraud',
    difficulty: 'Medium',
    question: 'Why do attackers use URL shortening services like "bit.ly" or "tinyurl.com" in phishing emails?',
    scenario: 'Link Hiding & Evasion',
    options: [
      'To make the email download faster',
      'To obscure the true destination URL and evade automated email security filters',
      'Because full URLs are illegal on web servers',
      'To encrypt the payload with SSL keys'
    ],
    correctAnswer: 1,
    explanation: 'URL shorteners hide the target domain, making it difficult for users and basic email scanners to inspect the destination without opening the link.'
  },
  {
    id: 11,
    category: 'Email Phishing',
    difficulty: 'Medium',
    question: 'An email arrives with the subject "INVOICE OVERDUE - LEGAL ACTION PENDING" demanding immediate payment within 1 hour. What psychological principle is being exploited?',
    scenario: 'Psychological Manipulation Tactics',
    options: [
      'Scarcity & Reciprocity',
      'Fear, Urgency, & Intimidation',
      'Social Proof & Authority',
      'Liking & Consensus'
    ],
    correctAnswer: 1,
    explanation: 'Phishing relies on high emotional arousal—fear, panic, and extreme artificial urgency—to bypass rational critical thinking so victims act before verifying.'
  },
  {
    id: 12,
    category: 'Smishing & Vishing',
    difficulty: 'Medium',
    question: 'You receive a phone call claiming to be from "Google Security" telling you your Gmail account was hacked. The caller asks for the 6-digit code sent to your phone. What should you do?',
    scenario: 'Phone Call Vishing & Verification Code Capture',
    options: [
      'Read out the code because Google security called you directly',
      'Hang up immediately! Never share one-time passcodes (OTPs) with anyone over the phone',
      'Ask the caller for their Google employee ID number and then give them the code',
      'Send the code via email to the caller\'s personal address'
    ],
    correctAnswer: 1,
    explanation: 'Legitimate tech companies (Google, Microsoft, Apple, Banks) NEVER call users asking for 2FA one-time passcodes over the phone. That code allows the attacker to finalize access to your account.'
  },
  {
    id: 13,
    category: 'Social Engineering',
    difficulty: 'Hard',
    question: 'An attacker leaves several USB flash drives labeled "Executive Salaries 2026.xlsx" in a corporate parking lot. What attack vector is this?',
    scenario: 'Curiosity-Driven Physical Trap',
    options: [
      'Watering Hole',
      'Baiting',
      'Dumpster Diving',
      'Shoulder Surfing'
    ],
    correctAnswer: 1,
    explanation: 'Baiting entices victims with physical media (like infected USB drives) designed to provoke curiosity or greed, installing malware upon insertion.'
  },
  {
    id: 14,
    category: 'URL Fraud',
    difficulty: 'Easy',
    question: 'Does the presence of "https://" and a padlock icon in a browser guarantee that a website is completely safe and NOT a phishing site?',
    scenario: 'SSL Certificate Misconception',
    options: [
      'Yes, https means the site is 100% verified and trustworthy',
      'No! HTTPS only means the connection is encrypted; phishing sites can easily obtain free SSL certificates',
      'Yes, Chrome automatically blocks all malicious sites with SSL',
      'No, because https is slower than http'
    ],
    correctAnswer: 1,
    explanation: 'HTTPS only guarantees transport encryption between your browser and the server. Today over 80% of phishing sites use valid SSL/TLS certificates (e.g. Let\'s Encrypt).'
  },
  {
    id: 15,
    category: 'Spear Phishing',
    difficulty: 'Hard',
    question: 'How does Spear Phishing differ from generic Phishing?',
    scenario: 'Targeted Threat Intelligence',
    options: [
      'Spear phishing uses audio files instead of text',
      'Spear phishing is highly targeted toward a specific individual or company, using customized background research',
      'Spear phishing only targets government satellites',
      'Spear phishing uses pop-up browser windows'
    ],
    correctAnswer: 1,
    explanation: 'Generic phishing broadcasts blanket spam. Spear phishing targets specific individuals with customized details (e.g. referencing actual colleagues, projects, or vendor names).'
  },
  {
    id: 16,
    category: 'Email Phishing',
    difficulty: 'Easy',
    question: 'When hovering your mouse cursor over a hyperlinked text like "Click Here to Update Account", what does the browser display in the bottom left status bar?',
    scenario: 'Hyperlink Pre-flight Inspection',
    options: [
      'The actual underlying destination URL',
      'The password associated with the account',
      'The IP address of your local router',
      'The date the website was registered'
    ],
    correctAnswer: 0,
    explanation: 'Hovering over a link reveals the real destination URL in your browser status bar, allowing you to spot domain mismatches before clicking.'
  },
  {
    id: 17,
    category: 'Social Engineering',
    difficulty: 'Medium',
    question: 'What is a "Watering Hole Attack"?',
    scenario: 'Strategic Compromise of Trusted Portals',
    options: [
      'Polluting a corporate drinking fountain',
      'Compromising a popular website frequently visited by a target organization to infect visitors',
      'Flooding a website with HTTP GET requests',
      'Stealing password sticky notes from employee desks'
    ],
    correctAnswer: 1,
    explanation: 'In a watering hole attack, adversaries observe which websites a target group relies on (e.g., industry news or supplier portals), compromise that site, and infect visitors.'
  },
  {
    id: 18,
    category: 'MFA & Credentials',
    difficulty: 'Medium',
    question: 'Which form of Multi-Factor Authentication (MFA) is MOST resistant to phishing attacks?',
    scenario: 'Authentication Security Hardening',
    options: [
      'SMS One-Time Passcodes (OTP)',
      'FIDO2 / WebAuthn Hardware Security Keys (e.g. YubiKey)',
      'Mobile App Push Notifications without number matching',
      'Email verification codes'
    ],
    correctAnswer: 1,
    explanation: 'FIDO2 / WebAuthn hardware security keys bind authentication to the legitimate origin domain at the cryptographic level, making them immune to proxy phishing and MITM credential harvesting.'
  },
  {
    id: 19,
    category: 'Email Phishing',
    difficulty: 'Hard',
    question: 'What security protocols (DNS records) help email receivers verify that an incoming email was genuinely sent by the domain owner and not spoofed?',
    scenario: 'Email Authentication Frameworks',
    options: [
      'FTP, SSH, and TELNET',
      'SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC',
      'HTTP, HTTPS, and TLS',
      'DHCP, NAT, and BGP'
    ],
    correctAnswer: 1,
    explanation: 'SPF specifies authorized sender IPs, DKIM signs message headers cryptographically, and DMARC instructs receiving servers how to handle non-compliant spoofed emails.'
  },
  {
    id: 20,
    category: 'Social Engineering',
    difficulty: 'Easy',
    question: 'You receive an unsolicited email asking you to complete a 2-minute employee survey in exchange for a free $50 gift card, requiring you to enter your corporate login credentials. What should you do?',
    scenario: 'Survey Credential Trap',
    options: [
      'Fill it out immediately to get the gift card',
      'Do not enter credentials! Report the suspicious email to the internal Information Security team',
      'Forward the survey to all your personal contacts',
      'Enter fake passwords until you receive the reward'
    ],
    correctAnswer: 1,
    explanation: 'Never enter corporate credentials into unverified third-party survey forms or external reward portals. Always report suspicious emails to your internal SOC / Security team.'
  }
];

export const INITIAL_STATS = {
  totalScans: 1420,
  safeScans: 890,
  suspiciousScans: 310,
  phishingScans: 220,
  avgRiskScore: 38.5,
  scanTrends: [
    { date: 'Mon', safe: 120, suspicious: 40, phishing: 25 },
    { date: 'Tue', safe: 145, suspicious: 52, phishing: 30 },
    { date: 'Wed', safe: 160, suspicious: 48, phishing: 35 },
    { date: 'Thu', safe: 130, suspicious: 55, phishing: 42 },
    { date: 'Fri', safe: 175, suspicious: 60, phishing: 48 },
    { date: 'Sat', safe: 80, suspicious: 25, phishing: 18 },
    { date: 'Sun', safe: 80, suspicious: 30, phishing: 22 }
  ],
  threatDistribution: [
    { name: 'Safe Content', value: 890, color: '#10B981' },
    { name: 'Suspicious Anomalies', value: 310, color: '#F59E0B' },
    { name: 'High-Risk Phishing', value: 220, color: '#EF4444' }
  ],
  categoryBreakdown: [
    { category: 'Credential Harvesting', count: 95 },
    { category: 'Malicious Links & Shorteners', count: 68 },
    { category: 'Urgency / Executive Fraud', count: 42 },
    { category: 'Fake Document / Storage', count: 15 }
  ],
  recentScans: [
    {
      id: 'scan-101',
      timestamp: '2026-07-25 18:42:10',
      type: 'url',
      target: 'http://secure-login-bankofamerica.com-account.xyz/update',
      classification: 'Phishing',
      confidenceScore: 96,
      riskScore: 92,
      indicators: [
        { type: 'danger', title: 'Typosquatting & Domain Spoofing', description: 'Domain tries to mimic Bank of America using crafted subdomains.', weight: 40 },
        { type: 'danger', title: 'High-Risk TLD (.xyz)', description: 'Unusual top-level domain frequently associated with spam.', weight: 25 },
        { type: 'warning', title: 'Suspicious Subdomain Depth', description: 'Subdomain depth > 3 indicates obfuscation.', weight: 20 }
      ],
      aiExplanation: 'Critical phishing threat detected. The URL utilizes domain spoofing techniques to trick users into believing they are visiting Bank of America while pointing to a third-party .xyz server.',
      preventionTips: [
        'Never enter bank credentials on non-official domain names.',
        'Verify SSL domain certificates directly in browser address bar.',
        'Use password managers that auto-fill ONLY on authentic domains.'
      ]
    },
    {
      id: 'scan-102',
      timestamp: '2026-07-25 18:30:15',
      type: 'email',
      target: 'URGENT: Your account access will be terminated in 24 hours. Verify credentials now.',
      classification: 'Phishing',
      confidenceScore: 94,
      riskScore: 88,
      indicators: [
        { type: 'danger', title: 'Urgency & Intimidation Language', description: 'Coercive language designed to induce panic ("terminated in 24 hours").', weight: 35 },
        { type: 'danger', title: 'Credential Verification Call-to-Action', description: 'Requests password verification.', weight: 35 }
      ],
      aiExplanation: 'High-risk email phishing threat. Utilizes social engineering coercion and fear to trick the victim into sharing login credentials.',
      preventionTips: [
        'Do not click links inside high-urgency notifications.',
        'Navigate directly to the official portal in a new browser tab.',
        'Report suspicious emails to your IT Security Operations team.'
      ]
    },
    {
      id: 'scan-103',
      timestamp: '2026-07-25 17:15:00',
      type: 'url',
      target: 'https://github.com/torvalds/linux',
      classification: 'Safe',
      confidenceScore: 99,
      riskScore: 5,
      indicators: [
        { type: 'success', title: 'Verified Domain', description: 'Authentic GitHub repository domain with valid SSL.', weight: 0 }
      ],
      aiExplanation: 'Safe URL. The domain belongs to GitHub with no detected anomalies or malicious redirects.',
      preventionTips: ['No risk detected. Safe to proceed.']
    }
  ] as ScanResult[]
};
