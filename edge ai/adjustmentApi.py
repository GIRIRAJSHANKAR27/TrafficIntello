import pickle
import pandas as pd

# Load pre-trained XGBoost model from the pickle file
with open("./models/xgb_model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_adjustment_factor(input_data):
    try:
        # Create a DataFrame from the input data
        input_df = pd.DataFrame([input_data])

        # Make prediction using the model
        prediction = model.predict(input_df)

        return {"adjustment_factor": float(prediction[0])}
    except Exception as e:
        return {"error": str(e)}
