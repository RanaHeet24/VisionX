import streamlit as st
import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import ta
import time
import os
from streamlit_autorefresh import st_autorefresh

# Constants
API_KEY = "CG-JrddorbGvoGXYrefNVosBPGk"
BASE_URL = "https://api.coingecko.com/api/v3"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Function to fetch top coins
def fetch_top_coins(limit=20):
    url = f"{BASE_URL}/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": limit,
        "page": 1,
        "sparkline": False
    }
    headers = {"x-cg-demo-api-key": API_KEY}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        return {coin['id']: coin['symbol'].upper() for coin in data}
    else:
        st.error(f"API Error: {response.status_code}")
        return {}

# Function to fetch live market data
def fetch_live_data(coin_id):
    url = f"{BASE_URL}/coins/markets"
    params = {
        "vs_currency": "usd",
        "ids": coin_id,
        "order": "market_cap_desc",
        "per_page": 1,
        "page": 1,
        "sparkline": False
    }
    headers = {"x-cg-demo-api-key": API_KEY}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        return data[0] if data else None
    else:
        st.error(f"API Error: {response.status_code}")
        return None

# Function to fetch historical price data
def fetch_historical_data(coin_id, days=90):
    url = f"{BASE_URL}/coins/{coin_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
        "interval": "daily"
    }
    headers = {"x-cg-demo-api-key": API_KEY}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        prices = data['prices']
        df = pd.DataFrame(prices, columns=['timestamp', 'price'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df.set_index('timestamp', inplace=True)
        return df
    else:
        st.error(f"API Error: {response.status_code}")
        return None

# Function to add technical indicators
def add_features(df):
    # Ensure we have enough data
    if len(df) < 21:
        return df

    # Calculate indicators
    df['SMA_7'] = ta.trend.sma_indicator(df['price'], window=7)
    df['SMA_21'] = ta.trend.sma_indicator(df['price'], window=21)
    df['EMA'] = ta.trend.ema_indicator(df['price'], window=14)
    df['RSI'] = ta.momentum.rsi(df['price'], window=14)
    df['Volatility'] = df['price'].rolling(window=14).std()
    df['Returns'] = df['price'].pct_change()

    # Create target: next price direction
    df['next_price'] = df['price'].shift(-1)
    df['direction'] = (df['next_price'] > df['price']).astype(int)

    # Drop NaN
    df.dropna(inplace=True)

    return df

# Function to initialize model for a coin
def initialize_model():
    scaler = StandardScaler()
    classifier = SGDClassifier(loss='log_loss', random_state=42)
    model_dict = {'scaler': scaler, 'classifier': classifier}
    return model_dict, 0, 0  # model_dict, correct_predictions, total_predictions

# Function to warmup model for a coin
def warmup_model(coin_id):
    hist_df = fetch_historical_data(coin_id, days=90)
    if hist_df is not None:
        hist_df = add_features(hist_df)
        if not hist_df.empty:
            model_dict, correct, total = initialize_model()
            scaler = model_dict['scaler']
            classifier = model_dict['classifier']
            for index, row in hist_df.iterrows():
                x_array = np.array([[row['SMA_7'], row['SMA_21'], row['EMA'], row['RSI'], row['Volatility'], row['Returns']]])
                y = row['direction']
                scaler.partial_fit(x_array)
                x_scaled = scaler.transform(x_array)
                if total > 0:
                    pred = classifier.predict(x_scaled)[0]
                    if pred == y:
                        correct += 1
                classifier.partial_fit(x_scaled, [y], classes=[0, 1])
                total += 1
            return model_dict, correct, total
    return None, 0, 0

# Function to update model online
def update_model_online(coin_id, x, y):
    if coin_id not in st.session_state["models"]:
        return
    model_dict, correct, total = st.session_state["models"][coin_id]
    scaler = model_dict['scaler']
    classifier = model_dict['classifier']
    x_array = np.array([list(x.values())])
    scaler.partial_fit(x_array)
    x_scaled = scaler.transform(x_array)
    pred = classifier.predict(x_scaled)[0]
    if pred == y:
        correct += 1
    classifier.partial_fit(x_scaled, [y], classes=[0, 1])
    total += 1
    st.session_state["models"][coin_id] = (model_dict, correct, total)

# Function to make prediction
def make_prediction(coin_id, x):
    if coin_id not in st.session_state["models"]:
        return None, 0
    model_dict, _, _ = st.session_state["models"][coin_id]
    scaler = model_dict['scaler']
    classifier = model_dict['classifier']
    x_array = np.array([list(x.values())])
    x_scaled = scaler.transform(x_array)
    prediction = classifier.predict(x_scaled)[0]
    proba = classifier.predict_proba(x_scaled)[0]
    confidence = max(proba)
    return prediction, confidence

# Function to compute cross-coin metrics
def compute_cross_coin_metrics(top_coins):
    # Fetch recent data for top 5
    data = {}
    for coin_id in list(top_coins.keys())[:5]:
        hist_df = fetch_historical_data(coin_id, days=30)
        if hist_df is not None:
            data[top_coins[coin_id]] = hist_df['price']
    if data:
        df = pd.DataFrame(data)
        correlation = df.corr()
        volatility = df.std()
        return correlation, volatility
    return None, None

# Main Streamlit app
def main():
    st.title("🚀 Multi-Crypto AI Signal Engine with Online Learning")

    # Auto refresh every 30 seconds
    st_autorefresh(interval=30 * 1000, key="auto")

    # Initialize session state
    if "models" not in st.session_state:
        st.session_state["models"] = {}
    if "top_coins" not in st.session_state:
        st.session_state["top_coins"] = fetch_top_coins()

    top_coins = st.session_state["top_coins"]
    if not top_coins:
        st.error("Failed to fetch top coins")
        return

    # Coin selection
    coin_options = list(top_coins.values())
    selected_symbol = st.selectbox("Select Cryptocurrency", coin_options)
    selected_coin_id = [k for k, v in top_coins.items() if v == selected_symbol][0]

    # Warmup if not done
    if selected_coin_id not in st.session_state["models"]:
        with st.spinner(f"Warming up model for {selected_symbol}..."):
            model, correct, total_samples = warmup_model(selected_coin_id)
            if model:
                st.session_state["models"][selected_coin_id] = (model, correct, total_samples)
            else:
                st.error("Failed to warmup model")
                return

    # Fetch live data
    live_data = fetch_live_data(selected_coin_id)
    if live_data is None:
        st.error("Failed to fetch live data")
        return

    current_price = live_data['current_price']
    price_change_24h = live_data['price_change_percentage_24h']
    market_cap = live_data['market_cap']

    # Generate features
    hist_df = fetch_historical_data(selected_coin_id, days=30)
    if hist_df is not None:
        hist_df = add_features(hist_df)
        if not hist_df.empty:
            latest_row = hist_df.iloc[-1]
            x = {
                'SMA_7': latest_row['SMA_7'],
                'SMA_21': latest_row['SMA_21'],
                'EMA': latest_row['EMA'],
                'RSI': latest_row['RSI'],
                'Volatility': latest_row['Volatility'],
                'Returns': latest_row['Returns']
            }
            y = latest_row['direction']

            # Make prediction
            prediction, confidence = make_prediction(selected_coin_id, x)

            # Update model
            update_model_online(selected_coin_id, x, y)

            # Get metrics
            _, correct, total_samples = st.session_state["models"][selected_coin_id]
            accuracy = correct / total_samples if total_samples > 0 else 0

            # Display for selected coin
            st.subheader(f"📊 {selected_symbol} Dashboard")
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Current Price", f"${current_price:.2f}", f"{price_change_24h:.2f}%")
            with col2:
                st.metric("Market Cap", f"${market_cap:,.0f}")
            with col3:
                st.metric("Model Accuracy", f"{accuracy:.2%}")
            with col4:
                st.metric("Samples Trained", total_samples)

            col5, col6 = st.columns(2)
            with col5:
                signal = "BUY" if prediction == 1 else "SELL"
                st.metric("Prediction", signal)
            with col6:
                st.metric("Confidence", f"{confidence:.2%}")

            # Charts
            st.line_chart(hist_df[['price', 'SMA_7', 'SMA_21', 'EMA']])

            # Debug
            st.write(f"Latest features: {x}")
            st.write(f"Prediction: {prediction}, Confidence: {confidence:.2%}, Accuracy: {accuracy:.2%}, Samples: {total_samples}")

    # Global dashboard
    st.subheader("🌍 Global Crypto Analytics")
    correlation, volatility = compute_cross_coin_metrics(top_coins)
    if correlation is not None:
        st.write("Correlation Matrix")
        st.dataframe(correlation)
        st.write("Volatility Ranking")
        st.bar_chart(volatility)

    # Top coins table
    st.write("Top Coins")
    top_data = []
    for coin_id, symbol in list(top_coins.items())[:10]:
        live = fetch_live_data(coin_id)
        if live:
            top_data.append({
                "Symbol": symbol,
                "Price": live['current_price'],
                "24h Change": live['price_change_percentage_24h'],
                "Market Cap": live['market_cap']
            })
    if top_data:
        st.dataframe(pd.DataFrame(top_data))

if __name__ == "__main__":
    main()
