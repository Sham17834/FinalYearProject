from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # 
from pydantic import BaseModel
import numpy as np
import joblib

# Load pre-trained artifacts
model = joblib.load('api/XGBoost_model.pkl')
scaler = joblib.load('api/scaler_final.pkl')
label_encoders = joblib.load('api/label_encoders_final.pkl')
selected_features = joblib.load('api/selected_features_final.pkl')

# FastAPI app
app = FastAPI(
    title="Multi-label XGBoost API",
    description="Predict Obesity, Hypertension, Stroke risk with probability.",
    version="1.0"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema and predict stays the same
class InputData(BaseModel):
    Age: int
    Gender: str
    Height_cm: float
    Weight_kg: float
    BMI: float
    Chronic_Disease: str
    Daily_Steps: float
    Exercise_Frequency: float
    Sleep_Hours: float
    Alcohol_Consumption: str
    Smoking_Habit: str
    Diet_Quality: str
    Stress_Level: float
    FRUITS_VEGGIES: float
    Screen_Time_Hours: float

@app.post("/predict")
async def predict(data: InputData):
    try:
        input_data = data.dict()

        input_processed = {}
        for col in selected_features:
            val = input_data[col]
            if col in label_encoders:
                encoder = label_encoders[col]
                val = encoder.transform([val])[0]
            input_processed[col] = val

        X = np.array([list(input_processed.values())])
        X_scaled = scaler.transform(X)

        pred = model.predict(X_scaled)[0].tolist()

        proba = []
        for estimator in model.estimators_:
            prob = estimator.predict_proba(X_scaled)[0][1]
            proba.append(float(prob))

        return {
            "Obesity_Flag": {
                "prediction": bool(pred[0]),
                "probability": proba[0]
            },
            "Hypertension_Flag": {
                "prediction": bool(pred[1]),
                "probability": proba[1]
            },
            "Stroke_Flag": {
                "prediction": bool(pred[2]),
                "probability": proba[2]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
