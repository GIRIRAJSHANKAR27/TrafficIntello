from flask import Flask, request, jsonify
import pickle
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load pre-trained XGBoost model from the pickle file
with open("./models/xgb_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict_adjustment_factor():
    try:
        # Get JSON data from the request
        data = request.json
        
        # Create a DataFrame from the input data
        input_data = pd.DataFrame([data])
        
        # Make prediction using the model
        prediction = model.predict(input_data)
        
        # Return the prediction result
        return jsonify({"adjustment_factor": float(prediction[0])})
    
    except Exception as e:
        # If there is an error, return it as a JSON response
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5001)
