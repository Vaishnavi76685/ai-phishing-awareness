import pandas as pd
import numpy as np
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def train():
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'phishing_dataset.csv')
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)

    print("Loading dataset from:", dataset_path)
    df = pd.read_csv(dataset_path)

    X = df['text']
    y = df['label'] # 0: Safe, 1: Suspicious, 2: Phishing

    print(f"Dataset shape: {df.shape}")
    print("Class distribution:\n", y.value_counts())

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1000)
    X_vec = vectorizer.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    model_path = os.path.join(model_dir, 'phishing_model.pkl')
    vectorizer_path = os.path.join(model_dir, 'vectorizer.pkl')

    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    print(f"\nSaved trained model to {model_path}")
    print(f"Saved TF-IDF vectorizer to {vectorizer_path}")

if __name__ == '__main__':
    train()
