from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

app = Flask(__name__)

df = pd.read_csv('updated_traffic_data.csv')
X = df.drop("Adjustment_Factor", axis=1)
y = df["Adjustment_Factor"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

@app.route('/predict', methods=['POST'])
def predict_adjustment_factor():
    try:
        data = request.json
        
        time_of_day = float(data['Time_of_Day'])
        day_of_week = int(data['Day_of_Week'])
        month = int(data['Month'])
        weather_condition = int(data['Weather_Condition'])
        temperature = float(data['Temperature'])
        humidity = float(data['Humidity'])
        traffic_volume = int(data['Traffic_Volume'])
        event_indicator = int(data['Event_Indicator'])

        input_data = pd.DataFrame({
            "Time_of_Day": [time_of_day],
            "Day_of_Week": [day_of_week],
            "Month": [month],
            "Weather_Condition": [weather_condition],
            "Temperature": [temperature],
            "Humidity": [humidity],
            "Traffic_Volume": [traffic_volume],
            "Event_Indicator": [event_indicator]
        })

        prediction = model.predict(input_data)
        return jsonify({"Predicted Adjustment Factor": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
