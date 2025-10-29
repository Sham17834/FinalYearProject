from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import time
import shap

# Initialize API
app = FastAPI(title="Health Risk Prediction API", version="1.0")

# Load model & preprocessors
try:
    model = joblib.load("C:\\IT\\FYP\\React Native\\HealthApps\\api\\XGBoost_model.pkl")  
    scaler = joblib.load("C:\\IT\\FYP\\React Native\\HealthApps\\api\\scaler_final.pkl")
    label_encoders = joblib.load("C:\\IT\\FYP\\React Native\\HealthApps\\api\\label_encoders_final.pkl")
    selected_features = joblib.load("C:\\IT\\FYP\\React Native\\HealthApps\\api\\selected_features_final.pkl")
except FileNotFoundError as e:
    raise Exception(f"Missing model or preprocessor file: {e}")

# Initialize SHAP explainers (one per target)
explainers = []
try:
    for estimator in model.estimators_:
        explainer = shap.TreeExplainer(estimator)
        explainers.append(explainer)
    print("SHAP explainers initialized successfully")
except Exception as e:
    print(f"Warning: Could not initialize SHAP explainers: {e}")
    explainers = None

# Define input data format
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

# Prediction endpoint
@app.post("/predict")
async def predict_risk(input_data: LifestyleInput):
    try:
        start_time = time.time()

        # Convert input to DataFrame
        data = pd.DataFrame([input_data.dict()])

        # Validate features
        if not all(feat in data.columns for feat in selected_features):
            missing = [feat for feat in selected_features if feat not in data.columns]
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")

        # Apply label encoders
        for column in label_encoders:
            if column in data.columns:
                valid_values = list(label_encoders[column].classes_)
                if data[column].iloc[0] not in valid_values:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value for {column}: {data[column].iloc[0]}. Valid values: {valid_values}"
                    )
                data[column] = label_encoders[column].transform(data[column])

        # Keep only selected features
        data = data[selected_features]

        # Scale input
        X_scaled = scaler.transform(data)

        # Predict labels
        y_pred = model.predict(X_scaled)

        # Predict probabilities (one per target)
        y_proba = [clf.predict_proba(X_scaled) for clf in model.estimators_]

        # Calculate SHAP values for this prediction
        shap_values_all = {}
        if explainers:
            try:
                target_names = ["Obesity_Flag", "Hypertension_Flag", "Stroke_Flag"]
                
                for i, (explainer, target) in enumerate(zip(explainers, target_names)):
                    # Calculate SHAP values
                    shap_values = explainer.shap_values(X_scaled)
                    
                    # Handle binary classification output format
                    if isinstance(shap_values, list):
                        shap_values = shap_values[1]
                    
                    # Get SHAP values for this instance
                    instance_shap = shap_values[0] if len(shap_values.shape) > 1 else shap_values
                    
                    # Create feature importance ranking
                    feature_importance = []
                    for feat_idx, feat_name in enumerate(selected_features):
                        feature_importance.append({
                            "feature": feat_name,
                            "shap_value": float(instance_shap[feat_idx]),
                            "abs_shap_value": float(abs(instance_shap[feat_idx]))
                        })
                    
                    # Sort by absolute SHAP value (most important first)
                    feature_importance.sort(key=lambda x: x["abs_shap_value"], reverse=True)
                    
                    # Store top 10 features for this target
                    shap_values_all[target] = feature_importance[:10]
                    
            except Exception as e:
                print(f"SHAP calculation error: {e}")
                shap_values_all = None
        else:
            shap_values_all = None

        # Format output
        predictions = {}
        target_names = ["Obesity_Flag", "Hypertension_Flag", "Stroke_Flag"]  
        for i, col in enumerate(target_names):
            predictions[col] = {
                "prediction": int(y_pred[0][i]),
                "probability": float(y_proba[i][0][1]) if y_proba[i].shape[1] > 1 else None,
                "shap_values": shap_values_all.get(col) if shap_values_all else None
            }

        inference_time = time.time() - start_time
        return {
            "predictions": predictions,
            "inference_time": round(inference_time, 4),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "API is running"}