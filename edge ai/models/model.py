
import pandas as pd
import xgboost as xgb
import pickle

df = pd.read_csv('realistic_adjustment_data.csv')
X = df.drop("Adjustment_Factor", axis=1)
y = df["Adjustment_Factor"]

model = xgb.XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.1)
model.fit(X, y)

with open("xgb_model.pkl", "wb") as f:
    pickle.dump(model, f)
