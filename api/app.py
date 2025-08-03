from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib

# -----------------------------
# ✅ Load pre-trained artifacts
rf_model = joblib.load('rf_model.pkl')
scaler = joblib.load('scaler_rf.pkl')
label_encoders = joblib.load('label_encoders_rf.pkl')
selected_features = joblib.load('selected_features_rf.pkl')

# -----------------------------
# ✅ FastAPI app
app = FastAPI(
    title="Multi-label Random Forest API (with Probability)",
    description="Predict Obesity, Hypertension, Stroke risk with probability.",
    version="1.0"
)

# -----------------------------
# ✅ Input schema
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

# -----------------------------
# ✅ Predict endpoint
@app.post("/predict")
async def predict(data: InputData):
    try:
        # -----------------------------
        # Convert to dict & DataFrame
        input_data = data.dict()
        input_df = {}

        for col in selected_features:
            value = input_data[col]
            if col in label_encoders:
                encoder = label_encoders[col]
                value = encoder.transform([value])[0]
            input_df[col] = [value]

        # -----------------------------
        # Scale
        X = np.array([list(input_df.values())])
        X_scaled = scaler.transform(X)

        # -----------------------------
        # Predict
        pred = rf_model.predict(X_scaled)[0].tolist()

        # -----------------------------
        # Probability for each label
        proba = []
        for estimator in rf_model.estimators_:
            prob = estimator.predict_proba(X_scaled)[0][1]  # Prob of class 1
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
