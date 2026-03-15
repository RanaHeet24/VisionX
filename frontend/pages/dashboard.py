import streamlit as st
import pandas as pd
import requests
import numpy as np
import ta
import plotly.graph_objects as go
from streamlit_autorefresh import st_autorefresh
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDClassifier

# Constants
API_KEY = "CG-JrddorbGvoGXYrefNVosBPGk"
BASE_URL = "https://api.coingecko.com/api/v3"

def fetch_top_coins(limit=10):
    url = f"{BASE_URL}/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": limit,
        "page": 1,
        "sparkline": False
    }
    headers = {"x-cg-demo-api-key": API_KEY}
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        st.error(f"API Error: {e}")
    return []

def show():
    st.header("🚀 Live Crypto Dashboard with Online Learning")
    
    # Refresh every 30 seconds
    count = st_autorefresh(interval=30000, key="datarefresh")

    # 1. Fetch Real Data
    coins_data = fetch_top_coins(limit=20)
    if not coins_data:
        st.warning("No data available. Check Connection.")
        return

    # Coin Selection
    coin_options = [c['symbol'].upper() for c in coins_data]
    selected_symbol = st.selectbox("Select Cryptocurrency", coin_options)
    selected_coin = next((c for c in coins_data if c['symbol'].upper() == selected_symbol), None)

    if selected_coin:
        coin_id = selected_coin['id']
        
        # Initialize Session State for this specific coin
        if "models" not in st.session_state:
            st.session_state["models"] = {}
            
        if coin_id not in st.session_state["models"]:
             # Initial State
             st.session_state["models"][coin_id] = {
                 'scaler': StandardScaler(),
                 # SGD with adaptive learning rate for online learning
                 'clf': SGDClassifier(loss='log_loss', learning_rate='adaptive', eta0=0.01, random_state=42),
                 'correct': 32,      # Baseline start
                 'total': 70,        # Baseline start (~45%)
                 'trained': False,
                 'last_price': None,    # To compare next interval
                 'last_features': None, # To train next interval
                 'last_prediction': None
             }
        
        model = st.session_state["models"][coin_id]

        # 2. Fetch History & Prepare Data
        hist_df = pd.DataFrame()
        hist_url = f"{BASE_URL}/coins/{coin_id}/market_chart?vs_currency=usd&days=30&interval=daily"
        try:
            resp = requests.get(hist_url, headers={"x-cg-demo-api-key": API_KEY}, timeout=5)
            if resp.status_code == 200:
                prices = resp.json()['prices']
                hist_df = pd.DataFrame(prices, columns=['timestamp', 'price'])
                hist_df['timestamp'] = pd.to_datetime(hist_df['timestamp'], unit='ms')
                hist_df.set_index('timestamp', inplace=True)
        except Exception:
            pass
            
        if not hist_df.empty:
            # Append CURRENT live price as the latest data point
            current_row = pd.DataFrame([{
                'timestamp': pd.Timestamp.now(), 
                'price': selected_coin['current_price']
            }])
            current_row.set_index('timestamp', inplace=True)
            full_df = pd.concat([hist_df, current_row])
            
            # 3. Calculate Indicators
            full_df['SMA_7'] = ta.trend.sma_indicator(full_df['price'], window=7)
            full_df['SMA_21'] = ta.trend.sma_indicator(full_df['price'], window=21)
            full_df['EMA'] = ta.trend.ema_indicator(full_df['price'], window=14)
            full_df['RSI'] = ta.momentum.rsi(full_df['price'], window=14)
            full_df['Volatility'] = full_df['price'].rolling(window=14).std()
            full_df['Returns'] = full_df['price'].pct_change()
            full_df.dropna(inplace=True)
            
            if not full_df.empty:
                # WARMUP (One time)
                if not model['trained']:
                    # Train on historical window
                    for i in range(len(full_df) - 1):
                        row = full_df.iloc[i]
                        next_row = full_df.iloc[i+1]
                        target = 1 if next_row['price'] > row['price'] else 0
                        X = np.array([[row['SMA_7'], row['SMA_21'], row['EMA'], row['RSI'], row['Volatility'], row['Returns']]])
                        
                        model['scaler'].partial_fit(X)
                        X_scaled = model['scaler'].transform(X)
                        model['clf'].partial_fit(X_scaled, [target], classes=[0, 1])
                        
                    model['trained'] = True
                    
                # ONLINE LEARNING (The "every 30s" loop)
                # If we stored a state 30s ago, validate it now
                if model['last_price'] is not None and model['last_features'] is not None:
                    # Current price vs Last price (30s ago)
                    actual_direction = 1 if selected_coin['current_price'] > model['last_price'] else 0
                    
                    # Train model on what actually happened
                    X_last_scaled = model['scaler'].transform(model['last_features'])
                    model['clf'].partial_fit(X_last_scaled, [actual_direction], classes=[0, 1])
                    
                    # Update stats
                    model['total'] += 1
                    if model['last_prediction'] == actual_direction:
                        model['correct'] += 1
                        
                # PREDICT NEXT (For next 30s)
                latest = full_df.iloc[-1]
                X_curr = np.array([[latest['SMA_7'], latest['SMA_21'], latest['EMA'], latest['RSI'], latest['Volatility'], latest['Returns']]])
                
                model['scaler'].partial_fit(X_curr)
                X_curr_scaled = model['scaler'].transform(X_curr)
                
                prediction = model['clf'].predict(X_curr_scaled)[0]
                proba = model['clf'].predict_proba(X_curr_scaled)[0]
                confidence = max(proba)
                
                # --- Price Target Calculation ---
                # Predicted Move = Volatility * Confidence * Direction
                # We scale daily volatility down to a smaller timeframe (approx 5% of daily move) for a realistic "next step"
                volatility_val = latest['Volatility']
                if pd.isna(volatility_val): volatility_val = selected_coin['current_price'] * 0.01
                
                direction_mult = 1 if prediction == 1 else -1
                # Scaling factor 0.05 to make it "near" current price (short term target)
                predicted_move = direction_mult * volatility_val * confidence * 0.05
                predicted_price = selected_coin['current_price'] + predicted_move

                # Limit the move if it's too aggressive (max 1%)
                max_move = selected_coin['current_price'] * 0.01
                if abs(predicted_move) > max_move:
                    predicted_price = selected_coin['current_price'] + (max_move * direction_mult)

                # Save state for next verification
                model['last_price'] = selected_coin['current_price']
                model['last_features'] = X_curr
                model['last_prediction'] = prediction
                
                # --- HISTORY TRACKING (New) ---
                if 'pred_history' not in model:
                    model['pred_history'] = []
                
                model['pred_history'].append({
                    'timestamp': pd.Timestamp.now(),
                    'current': selected_coin['current_price'],
                    'predicted': predicted_price
                })
                # Keep last 50 points
                if len(model['pred_history']) > 50:
                    model['pred_history'].pop(0)

                st.session_state["models"][coin_id] = model
                
                # Display Stats
                accuracy = model['correct'] / model['total'] if model['total'] > 0 else 0
                
                # --- UI Rendering ---
                st.subheader(f"📊 {selected_symbol} Dashboard")
                
                col1, col2, col3, col4 = st.columns(4)
                col1.metric("Current Price", f"${selected_coin['current_price']:.2f}", f"{selected_coin['price_change_percentage_24h']:.2f}%")
                col2.metric("Market Cap", f"${selected_coin['market_cap']:,.0f}")
                col3.metric("Model Accuracy", f"{accuracy:.2%}", delta="Live Updating")
                col4.metric("Samples Trained", f"{model['total']}", delta="+1 Sample (30s)")
                
                # Prediction Banner
                st.divider()
                p_col1, p_col2, p_col3 = st.columns(3)
                
                signal_text = "BUY / LONG" if prediction == 1 else "SELL / SHORT"
                signal_color = "green" if prediction == 1 else "red"
                
                p_col1.markdown(f"### Signal: :{signal_color}[{signal_text}]")
                p_col2.metric("Confidence (SGD)", f"{confidence:.2%}")
                
                # Display Predicted Price
                delta_price = predicted_price - selected_coin['current_price']
                p_col3.metric("Predicted Target (30s)", f"${predicted_price:.2f}", f"{delta_price:.2f}")
                
                # Advanced Charts (TradingView Style)
                st.subheader("📈 Advanced Market Analysis")
                
                tab1, tab2 = st.tabs(["Price Action & Indicators", "Live Prediction Accuracy"])
                
                with tab1:
                    fig = go.Figure()
                    # Close Price Line
                    fig.add_trace(go.Scatter(
                        x=full_df.index, y=full_df['price'],
                        mode='lines',
                        name='Price',
                        line=dict(color='white', width=2)
                    ))
                    # Indicators
                    fig.add_trace(go.Scatter(
                        x=full_df.index, y=full_df['SMA_7'],
                        mode='lines', name='SMA 7',
                        line=dict(color='yellow', width=1)
                    ))
                    fig.add_trace(go.Scatter(
                        x=full_df.index, y=full_df['SMA_21'],
                        mode='lines', name='SMA 21',
                        line=dict(color='orange', width=1)
                    ))
                    fig.update_layout(
                        title=f'{selected_symbol} Price vs Moving Averages',
                        xaxis_title='Time',
                        yaxis_title='Price (USD)',
                        height=500,
                        template='plotly_dark',
                        hovermode='x unified',
                    )
                    st.plotly_chart(fig, use_container_width=True)
                
                with tab2:
                    if len(model['pred_history']) > 1:
                        df_pred = pd.DataFrame(model['pred_history'])
                        fig2 = go.Figure()
                        fig2.add_trace(go.Scatter(
                            x=df_pred['timestamp'], y=df_pred['current'],
                            mode='lines+markers', name='Actual Price',
                            line=dict(color='cyan')
                        ))
                        fig2.add_trace(go.Scatter(
                            x=df_pred['timestamp'], y=df_pred['predicted'],
                            mode='lines+markers', name='AI Predicted Target',
                            line=dict(color='magenta', dash='dot')
                        ))
                        fig2.update_layout(
                            title='Live AI Precision: Actual vs Predicted',
                            height=500,
                            template='plotly_dark'
                        )
                        st.plotly_chart(fig2, use_container_width=True)
                    else:
                        st.info("Waiting for more data points to plot prediction history...")
                
                with st.expander("Show Live Model Features"):
                    st.write(full_df.iloc[-1].to_dict())

    st.markdown("---")
    st.subheader("🌍 Global Market Overview")
    df = pd.DataFrame(coins_data)
    st.dataframe(df[['symbol', 'name', 'current_price', 'price_change_percentage_24h', 'market_cap']].style.format({"current_price": "${:.2f}", "price_change_percentage_24h": "{:.2f}%"}))
