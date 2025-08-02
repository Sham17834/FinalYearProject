from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import time
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

current_dir = os.path.dirname(os.path.abspath(__file__))

# Load model and preprocessing components using absolute paths
try:
    model = joblib.load(os.path.join(current_dir, 'xgb_model.pkl'))
    scaler = joblib.load(os.path.join(current_dir, 'scaler.pkl'))
    selector = joblib.load(os.path.join(current_dir, 'selector.pkl'))
    target_encoder = joblib.load(os.path.join(current_dir, 'target_encoder.pkl'))
    label_encoders = joblib.load(os.path.join(current_dir, 'label_encoders.pkl'))
    selected_features = joblib.load(os.path.join(current_dir, 'selected_features.pkl'))
    shap_summary = joblib.load(os.path.join(current_dir, 'shap_summary.pkl'))
except FileNotFoundError as e:
    raise Exception(f"Model or preprocessor file missing: {e}")

# Define input data model containing 14 lifestyle features
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
        # Convert input data to DataFrame
        data = pd.DataFrame([input_data.dict()])

        # Verify all required features exist
        if not all(feat in data.columns for feat in selected_features):
            missing = [feat for feat in selected_features if feat not in data.columns]
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")

        # Validate and encode categorical variables
        for column in label_encoders:
            if column in data.columns:
                valid_values = list(label_encoders[column].classes_)
                if data[column].iloc[0] not in valid_values:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value for {column}: {data[column].iloc[0]}. Valid values: {valid_values}"
                    )
                data[column] = label_encoders[column].transform(data[column])

        # Ensure only model-required features are used
        data = data[selected_features]

        # Standardize and select features
        X_scaled = scaler.transform(data)
        X_selected = selector.transform(X_scaled)

        # Generate prediction
        prediction = model.predict(X_selected)[0]
        risk_level = target_encoder.inverse_transform([prediction])[0]

        # Calculate inference time
        inference_time = time.time() - start_time
        if inference_time > 5:
            print(f"Warning: Inference time {inference_time:.2f} seconds exceeds 5 seconds requirement")

        # Return results
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
    """Verify if the API is running properly"""
    return {"status": "API is running"}
