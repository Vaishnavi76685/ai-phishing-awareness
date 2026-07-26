import os
import re
import joblib
from urllib.parse import urlparse

class PhishingPredictor:
    def __init__(self):
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')
        vectorizer_path = os.path.join(base_dir, 'models', 'vectorizer.pkl')
        
        self.model = None
        self.vectorizer = None
        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)

    def analyze_url(self, url):
        indicators = []
        risk_score = 0

        # Heuristic Checks
        ip_pattern = r'http[s]?://(?:\d{1,3}\.){3}\d{1,3}'
        if re.search(ip_pattern, url):
            indicators.append({'title': 'IP Address in Hostname', 'description': 'Legitimate services rarely use raw IP addresses.', 'weight': 35})
            risk_score += 35

        if len(url) > 75:
            indicators.append({'title': 'Excessive URL Length', 'description': 'Long URLs are often used to obfuscate malicious domains.', 'weight': 15})
            risk_score += 15

        subdomain_count = urlparse(url).netloc.count('.')
        if subdomain_count > 3:
            indicators.append({'title': 'Multiple Subdomains', 'description': 'High subdomain count detected, common in spoofing.', 'weight': 20})
            risk_score += 20

        suspicious_tlds = ['.xyz', '.top', '.tk', '.zip', '.click', '.gq', '.cf']
        if any(url.endswith(tld) or (tld + '/') in url for tld in suspicious_tlds):
            indicators.append({'title': 'High-Risk TLD', 'description': 'Top-Level Domain frequently associated with spam.', 'weight': 25})
            risk_score += 25

        if '@' in url:
            indicators.append({'title': '@ Symbol in URL', 'description': 'Browsers ignore text before @ symbol, misleading users.', 'weight': 30})
            risk_score += 30

        shorteners = ['bit.ly', 'tinyurl.com', 'is.gd', 'goo.gl', 't.co', 'cutt.ly']
        if any(s in url for s in shorteners):
            indicators.append({'title': 'URL Shortening Service', 'description': 'Hides final destination address.', 'weight': 20})
            risk_score += 20

        # Classification
        classification = 'Safe'
        if risk_score >= 50:
            classification = 'Phishing'
        elif risk_score >= 20:
            classification = 'Suspicious'

        confidence = min(98, max(60, 50 + risk_score // 2))

        return {
            'classification': classification,
            'risk_score': min(100, risk_score),
            'confidence': confidence,
            'indicators': indicators,
            'explanation': f"URL analyzed with risk score {risk_score}/100. Detected {len(indicators)} security anomalies."
        }

    def analyze_email(self, content):
        indicators = []
        risk_score = 0

        urgent_keywords = ['urgent', 'immediately', 'suspended', '24 hours', 'action required', 'terminate', 'unauthorized access']
        found_urgency = [w for w in urgent_keywords if w in content.lower()]
        if found_urgency:
            indicators.append({'title': 'Urgency & Fear Language', 'description': f'Detected pressure tactics: {", ".join(found_urgency)}', 'weight': 30})
            risk_score += 30

        credential_words = ['password', 'verify', 'ssn', 'login', 'update payment', 'bank account', 'credential', 'credit card']
        found_creds = [w for w in credential_words if w in content.lower()]
        if found_creds:
            indicators.append({'title': 'Credential Harvesting Keywords', 'description': f'Requests sensitive data: {", ".join(found_creds)}', 'weight': 35})
            risk_score += 35

        if re.search(r'http[s]?://\S+', content):
            indicators.append({'title': 'Embedded Hyperlinks', 'description': 'Contains external links requiring verification.', 'weight': 15})
            risk_score += 15

        classification = 'Safe'
        if risk_score >= 50:
            classification = 'Phishing'
        elif risk_score >= 20:
            classification = 'Suspicious'

        return {
            'classification': classification,
            'risk_score': min(100, risk_score),
            'confidence': min(99, max(65, 55 + risk_score // 2)),
            'indicators': indicators,
            'explanation': f"Email analyzed with risk score {risk_score}/100 based on natural language keywords and link heuristics."
        }

if __name__ == '__main__':
    predictor = PhishingPredictor()
    print("URL Test:", predictor.analyze_url("http://192.168.1.1/login"))
    print("Email Test:", predictor.analyze_email("URGENT: Verify your password now at http://fakebank.com"))
