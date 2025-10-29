# main.py
import os
import time
import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

# ----------------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------------
app = FastAPI(
    title="Health Risk Prediction API",
    version="2.2",
    description="Obesity / Hypertension / Stroke + SHAP (no background.pkl)"
)

# ----------------------------------------------------------------------
# 2. Load artefacts (Render-friendly)
# ----------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH          = os.path.join(BASE_DIR, "XGBoost_model.pkl")
SCALER_PATH         = os.path.join(BASE_DIR, "scaler_final.pkl")
LE_PATH             = os.path.join(BASE_DIR, "label_encoders_final.pkl")
FEATURES_PATH       = os.path.join(BASE_DIR, "selected_features_final.pkl")

model           = joblib.load(MODEL_PATH)
scaler          = joblib.load(SCALER_PATH)
label_encoders  = joblib.load(LE_PATH)
selected_features = joblib.load(FEATURES_PATH)

# ----------------------------------------------------------------------
# 3. Input schema – exactly what RN sends
# ----------------------------------------------------------------------
class LifestyleInput(BaseModel):
    Age: int = Field(..., ge=0, le=120)
    Gender: Literal["Male", "Female", "Other"]
    Height_cm: float = Field(..., ge=100, le=250)
    Weight_kg: float = Field(..., ge=30, le=300)
    BMI: float = Field(..., ge=10, le=60)
    Daily_Steps: int = Field(..., ge=0)
    Exercise_Frequency: int = Field(..., ge=0, le=7)
    Sleep_Hours: float = Field(..., ge=0, le=24)
    Alcohol_Consumption: Literal["No", "Occasionally", "Frequently", "Heavy"]
    Smoking_Habit: Literal["No", "Occasionally", "Daily", "Heavy"]
    Diet_Quality: Literal["Poor", "Average", "Good", "Excellent"]
    Stress_Level: int = Field(..., ge=1, le=10)
    FRUITS_VEGGIES: int = Field(..., ge=0, le=10)
    Screen_Time_Hours: float = Field(..., ge=0, le=24)

# ----------------------------------------------------------------------
# 4. Helper: payload → DataFrame with **exact training order**
# ----------------------------------------------------------------------
def payload_to_df(payload: dict) -> pd.DataFrame:
    df = pd.DataFrame([payload])

    # One-hot encode categoricals (same as training)
    cat_cols = ["Gender", "Alcohol_Consumption", "Smoking_Habit", "Diet_Quality"]
    df = pd.get_dummies(df, columns=cat_cols, drop_first=False)

    # Ensure every selected feature exists
    for col in selected_features:
        if col not in df.columns:
            df[col] = 0
    df = df.reindex(columns=selected_features, fill_value=0)
    return df

# ----------------------------------------------------------------------
# 5. SHAP top-features (TreeExplainer → Kernel fallback)
# ----------------------------------------------------------------------
def compute_shap_top_features(X_scaled: pd.DataFrame, top_n: int = 5):
    result = {}
    target_names = ["Obesity_Flag", "Hypertension_Flag", "Stroke_Flag"]

    for idx, disease in enumerate(target_names):
        try:
            # ---------- TreeExplainer (fast, no background) ----------
            explainer = shap.TreeExplainer(model.estimators_[idx])
            shap_vals = explainer.shap_values(X_scaled)

            # For binary classification XGBoost returns list [neg, pos]; we want pos
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1]

            values = np.array(shap_vals).reshape(-1)
            abs_vals = np.abs(values)
            top_idx = np.argsort(abs_vals)[-top_n:][::-1]

            result[disease] = [
                {"feature": X_scaled.columns[i], "shap_value": float(values[i])}
                for i in top_idx
            ]

        except Exception as tree_err:
            # ---------- Kernel fallback (tiny background from current row) ----------
            try:
                # Duplicate current row 10 times → tiny background
                bg = pd.concat([X_scaled] * 10, ignore_index=True)
                k_explainer = shap.KernelExplainer(
                    lambda x: model.estimators_[idx].predict_proba(x)[:, 1],
                    bg,
                    link="logit"
                )
                shap_vals = k_explainer.shap_values(X_scaled, nsamples=50)
                values = np.array(shap_vals).reshape(-1)
                abs_vals = np.abs(values)
                top_idx = np.argsort(abs_vals)[-top_n:][::-1]

                result[disease] = [
                    {"feature": X_scaled.columns[i], "shap_value": float(values[i])}
                    for i in top_idx
                ]
            except Exception as k_err:
                print(f"SHAP failed for {disease}: Tree={tree_err}, Kernel={k_err}")
                result[disease] = []   # empty list → RN shows "no SHAP"

    return result

# ----------------------------------------------------------------------
# 6. /predict endpoint
# ----------------------------------------------------------------------
@app.post("/predict")
async def predict_risk(input_data: LifestyleInput):
    start = time.time()
    try:
        # 1. Convert payload
        df_raw = payload_to_df(input_data.dict())

        # 2. Scale → keep column names → no warning
        X_scaled = pd.DataFrame(
            scaler.transform(df_raw),
            columns=df_raw.columns,
            index=df_raw.index
        )

        # 3. Predict
        y_pred = model.predict(X_scaled)                     # (1, 3)
        probas = [est.predict_proba(X_scaled)[:, 1][0]       # positive class
                  for est in model.estimators_]

        # 4. SHAP
        shap_top = compute_shap_top_features(X_scaled, top_n=5)

        # 5. Build response
        predictions = {}
        for i, disease in enumerate(["Obesity_Flag", "Hypertension_Flag", "Stroke_Flag"]):
            predictions[disease] = {
                "prediction": bool(y_pred[0][i]),
                "probability": float(probas[i]),
                "top_features": shap_top.get(disease, [])
            }

        return {
            "predictions": predictions,
            "inference_time": round(time.time() - start, 4),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# ----------------------------------------------------------------------
# 7. Health check
# ----------------------------------------------------------------------
@app.get("/health")
async def health_check():
    return {"status": "API running", "model_loaded": True}