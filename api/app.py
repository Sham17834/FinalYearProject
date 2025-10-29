from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import shap
import time
import os

# Initialize FastAPI
app = FastAPI(
    title="Health Risk Prediction API",
    version="2.0",
    description="Predicts risk for Obesity, Hypertension, and Stroke with SHAP explainability."
)

# Load model and preprocessors
MODEL_DIR = r"C:\IT\FYP\React Native\HealthApps\api"

try:
    model = joblib.load("XGBoost_model.pkl")
    scaler = joblib.load("scaler_final.pkl")
    label_encoders = joblib.load("label_encoders_final.pkl")
    selected_features = joblib.load("selected_features_final.pkl")
except FileNotFoundError as e:
    raise Exception(f"❌ Missing model or preprocessor file: {e}")

# Try loading SHAP explainers 
explainers = None
try:
    shap_explainers = joblib.load("shap_explainers.pkl")
    explainers = shap_explainers if shap_explainers else None
    print("✅ SHAP explainers loaded successfully")
except Exception as e:
    print(f"⚠️ SHAP explainers not available: {e}")
    explainers = None

# Input Data Schema
class LifestyleInput(BaseModel):
    Age: int
    Gender: str
    Height_cm: float
    Weight_kg: float
    BMI: float
    Daily_Steps: int
    Exercise_Frequency: int
    Sleep_Hours: float
    Alcohol_Consumption: str
    Smoking_Habit: str
    Diet_Quality: str
    Stress_Level: int
    FRUITS_VEGGIES: int
    Screen_Time_Hours: float


# Prediction Endpoint
@app.post("/predict")
async def predict_risk(input_data: LifestyleInput):
    try:
        start_time = time.time()

        # Convert input to DataFrame
        df = pd.DataFrame([input_data.dict()])

        # Validate all features exist
        missing = [f for f in selected_features if f not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")

        # Apply label encoders
        for col in label_encoders:
            if col in df.columns:
                valid_values = list(label_encoders[col].classes_)
                value = df[col].iloc[0]
                if value not in valid_values:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value for {col}: {value}. Valid values: {valid_values}"
                    )
                df[col] = label_encoders[col].transform(df[col])

        # Keep only model features
        df = df[selected_features]

        # Scale input
        X_scaled = scaler.transform(df)

        # Predictions
        y_pred = model.predict(X_scaled)
        y_proba = [clf.predict_proba(X_scaled) for clf in model.estimators_]

        # Compute SHAP Values
        shap_values_all = {}
        target_names = ["Obesity_Flag", "Hypertension_Flag", "Stroke_Flag"]

        if explainers:
            for i, (explainer, target) in enumerate(zip(explainers, target_names)):
                try:
                    shap_values = explainer.shap_values(X_scaled)
                    if isinstance(shap_values, list):
                        shap_values = shap_values[1]

                    instance_shap = shap_values[0]
                    feature_importance = [
                        {
                            "feature": feat,
                            "shap_value": float(instance_shap[j]),
                            "abs_shap_value": float(abs(instance_shap[j]))
                        }
                        for j, feat in enumerate(selected_features)
                    ]
                    feature_importance.sort(key=lambda x: x["abs_shap_value"], reverse=True)
                    shap_values_all[target] = feature_importance[:10]
                except Exception as e:
                    print(f"⚠️ SHAP calculation failed for {target}: {e}")
                    shap_values_all[target] = None
        else:
            shap_values_all = None

        # Format Output
        predictions = {}
        for i, col in enumerate(target_names):
            predictions[col] = {
                "prediction": int(y_pred[0][i]),
                "probability": float(y_proba[i][0][1]) if y_proba[i].shape[1] > 1 else None,
                "top_features": shap_values_all.get(col) if shap_values_all else None
            }

        response = {
            "predictions": predictions,
            "inference_time": round(time.time() - start_time, 4),
            "status": "success"
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# Health Check Endpoint
@app.get("/health")
async def health_check():
    return {"status": "✅ API is running properly"}