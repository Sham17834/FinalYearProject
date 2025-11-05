# 🩺 Lifestyle Scoring and Chronic Disease Risk Analysis System

A **mobile health application** developed as part of a **Final Year Project (FYP)** that integrates **machine learning**, **React Native**, and **FastAPI** to evaluate users’ lifestyle habits and predict chronic disease risks such as **obesity**, **hypertension**, and **stroke**.  

This system aims to empower individuals with **personalized health insights**, bridging the gap between health analytics and accessible digital healthcare.

---

## 📱 Overview

The **Lifestyle Scoring and Chronic Disease Risk Analysis System** collects lifestyle-related data (e.g., diet, sleep, exercise, habits) through a user-friendly mobile app. It calculates a **Healthy Lifestyle Score** and predicts potential chronic disease risks using trained **machine learning models**.

This system was built for academic research and demonstration purposes under the supervision of **Dr. Attif Mahood** and **Sham Soon Yong** at **INTI International University**.

---

## 🧠 Key Features

- ✅ **Healthy Lifestyle Scoring** – Quantifies user health habits into a measurable score.  
- 🧩 **Chronic Disease Prediction** – Predicts risk flags (Obesity, Hypertension, Stroke) using trained ML models.  
- 📊 **Explainable AI (SHAP)** – Provides model interpretability and transparency in health predictions.  
- 🔐 **Firebase Authentication** – Secure login and account management using Google Sign-In.  
- 🧾 **Personalized Reports** – Displays health insights and recommendations tailored to user lifestyle data.  
- 🌐 **Multi-Platform Compatibility** – Developed using **React Native (Expo)** for both Android and iOS.  
- ⚙️ **FastAPI Backend** – Handles API requests, model inference, and data preprocessing efficiently.  

---

## 🏗️ System Architecture

**Frontend (Mobile App):**
- Built using **React Native (Expo)**  
- UI design inspired by Figma wireframes  
- Screens include: Login, Lifestyle Data Input, Score Report, and Risk Prediction  

**Backend (API):**
- Developed with **FastAPI (Python)**  
- Handles ML model predictions and data validation  
- Integrates with Firebase for authentication and user data management  

**Machine Learning Layer:**
- Models trained using **XGBoost**, **Random Forest**, and **Logistic Regression**  
- Data preprocessing includes normalization, feature selection, and encoding  
- Evaluation metrics: Accuracy, Macro F1-Score, Subset Accuracy  

---

## ⚙️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| Frontend | React Native (Expo), JavaScript |
| Backend | FastAPI (Python) |
| Database / Auth | Firebase, SQLite |
| Machine Learning | Scikit-learn, XGBoost, Pandas, Joblib |
| Visualization | SHAP, Matplotlib |
| Deployment | Expo EAS, Localhost (FastAPI) |

---

## 📂 Project Structure

