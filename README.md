# Lifestyle Scoring and Chronic Disease Risk Analysis System

## 📘 Overview
This Final Year Project (FYP) presents the **Lifestyle Scoring and Chronic Disease Risk Analysis System**, an intelligent mobile-based application designed to evaluate users’ lifestyle habits and predict potential chronic disease risks. The system integrates **machine learning**, **FastAPI**, and **React Native (Expo)** to deliver personalized health analytics and preventive insights.

The goal is to transform self-reported lifestyle data (diet, activity, sleep, and habits) into a measurable **Healthy Lifestyle Score** and predict risks for **obesity, hypertension, and stroke** using trained machine-learning models.

---

## ⚙️ System Architecture
The project consists of three main components:

1. **Frontend (React Native / Expo)**
   - Cross-platform mobile app (Android & iOS)
   - User authentication via Firebase
   - Interactive UI for data input, score display, and personalized recommendations

2. **Backend (FastAPI - Python)**
   - FastAPI handling data processing and model inference
   - Integration with trained ML models (XGBoost, Random Forest, Logistic Regression)
   - JSON-based communication between app and API

3. **Machine Learning Models**
   - Trained using public and custom health datasets
   - Features include age, BMI, activity level, smoking, alcohol intake, sleep duration, and more
   - Evaluated with metrics such as Subset Accuracy and Macro F1-Score
   - Explainability via **SHAP** values for transparent prediction insights

---

## 🧠 Key Features
- Personalized **Healthy Lifestyle Score**
- Risk prediction for **Obesity**, **Hypertension**, and **Stroke**
- Explainable AI (SHAP) visualization
- Firebase authentication (Google login, account deletion)
- Local and remote data handling (SQLite + Firebase)
- Multi-language support (English, Chinese, Malay)
- User-friendly, minimalistic design with responsive UI

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React Native (Expo), JavaScript |
| Backend | FastAPI, Python |
| ML Models | XGBoost, Scikit-Learn, Pandas, NumPy |
| Database | Firebase, SQLite |
| Authentication | Firebase Auth |
| Explainability | SHAP |
| Design Tools | Figma (UI/UX Wireframes) |

---

## 🧪 Model Evaluation Summary
| Model | Subset Accuracy | Macro F1 | Remark |
|-------|------------------|----------|--------|
| XGBoost | 0.8160 | 0.9749 | Best performance, selected as final model |
| KNN | 0.7630 | 0.8204 | Moderate accuracy |
| Logistic Regression | 0.3445 | 0.4692 | Baseline model |

