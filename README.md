# 🩺 Lifestyle Scoring & Chronic Disease Risk Analysis System  
**Final Year Project – INTI International University**  
[![License](https://img.shields.io/badge/License-Academic%20Use%20Only-red.svg)](LICENSE)  
[![React Native](https://img.shields.io/badge/Frontend-React%20Native%20(Expo)-61DAFB?logo=react)](https://reactnative.dev)  
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)  
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%2081.6%25%20Acc-f28c38?logo=xgboost)](https://xgboost.ai)  
[![Firebase](https://img.shields.io/badge/Auth-Firebase%20Auth-FFCA28?logo=firebase)](https://firebase.google.com)  
[![Expo](https://img.shields.io/badge/Build-Expo%20EAS-000000?logo=expo)](https://expo.dev)  
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org)  
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen)]()

An **AI-powered mobile health app** that scores your daily habits and predicts your risk of **Obesity**, **Hypertension**, and **Stroke** — all in one tap.

Built with **React Native (Expo)**, **FastAPI**, and **XGBoost + SHAP** for crystal-clear, explainable insights.

---

## 🚀 Live Demo  
<img src="./assets/demo.gif" width="250" align="right" alt="App Demo" />  

- **Dashboard** – See your **Healthy Lifestyle Score (0-100)**  
- **Risk Radar** – Visual risk levels for 3 chronic diseases  
- **SHAP Explainer** – “Why did the AI flag you high-risk?”  

---

## 📱 Key Features  

| Feature                  | Tech Used                     |
|--------------------------|-------------------------------|
| 🧠 **Multi-Disease Prediction** | XGBoost (81.6% acc) + SHAP    |
| 💪 **Lifestyle Score Engine**  | Custom weighted algorithm     |
| 🔐 **Secure Google Login**     | Firebase Auth + Firestore     |
| 📊 **Interactive Charts**      | Victory Native + Reanimated   |
| 🛡️ **Input Sanitization**     | Pydantic + React Hook Form    |

---

## 🏆 Model Leaderboard  

| Model               | Accuracy | Macro F1 | Status      |
|---------------------|----------|----------|-------------|
| **XGBoost**         | **0.8160** | **0.9749** | ✅ Final     |
| Random Forest       | 0.792    | 0.891    | Runner-up   |
| Logistic Regression | 0.345    | 0.469    | Benchmark   |
| KNN                 | 0.763    | 0.820    | Baseline    |

*Trained on 15,000+ anonymized lifestyle records.*

---

## 🧩 System Architecture  

```mermaid
graph LR
  A[React Native App] --> B[FastAPI Backend]
  B --> C[XGBoost Models]
  B --> D[SHAP Explainer]
  A --> E[Firebase Auth]
  E --> F[Firestore DB]
  A --> G[Expo EAS Build]
