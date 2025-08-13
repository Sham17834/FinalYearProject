from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import time

app = FastAPI()

try:
    model = joblib.load('xgb_model.pkl')
    scaler = joblib.load('scaler.pkl')
    selector = joblib.load('selector.pkl')
    target_encoder = joblib.load('target_encoder.pkl')
    label_encoders = joblib.load('label_encoders.pkl')
    selected_features = joblib.load('selected_features.pkl')
    shap_summary = joblib.load('shap_summary.pkl')
except FileNotFoundError as e:
    raise Exception(f"Model or preprocessor file missing: {e}")

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

@app.post("/predict")
async def predict_risk(input_data: LifestyleInput):
    try:
        start_time = time.time()

        data = pd.DataFrame([input_data.dict()])

        if not all(feat in data.columns for feat in selected_features):
            missing = [feat for feat in selected_features if feat not in data.columns]
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")

        for column in label_encoders:
            if column in data.columns:
                valid_values = list(label_encoders[column].classes_)
                if data[column].iloc[0] not in valid_values:
                    raise HTTPException(status_code=400, detail=f"Invalid value for {column}: {data[column].iloc[0]}. Valid values: {valid_values}")
                data[column] = label_encoders[column].transform(data[column])

        data = data[selected_features]

        X_scaled = scaler.transform(data)
        X_selected = selector.transform(X_scaled)

        # Predict
        prediction = model.predict(X_selected)[0]
        risk_level = target_encoder.inverse_transform([prediction])[0]

        inference_time = time.time() - start_time
        if inference_time > 5:
            print(f"Warning: Inference time {inference_time:.2f} seconds exceeds 5 seconds requirement")

        return {
            "risk_level": risk_level,
            "shap_explanations": {k: float(v) for k, v in shap_summary.items()},
            "inference_time": inference_time,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "API is running"}
