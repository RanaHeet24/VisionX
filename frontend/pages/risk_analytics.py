import streamlit as st
from backend.engine.risk_engine import risk_engine

def show():
    st.header("🛡️ Institutional Risk Analytics")
    
    # Portfolio Risk
    st.subheader("Portfolio VaR (Value at Risk)")
    st.write("Confidence Level: 95%")
    # Mock returns
    returns = [0.01, -0.02, 0.015, -0.005, 0.01] * 10
    var = risk_engine.calculate_var(returns, 100000)
    st.metric("Daily VaR", f"${var:.2f}")
    
    st.subheader("Position Sizing Calculator")
    capital = st.number_input("Capital", 100000)
    risk_pct = st.slider("Risk Per Trade", 0.01, 0.05, 0.01)
    sl_pips = st.number_input("Stop Loss (Pips)", 50)
    
    size = risk_engine.calculate_position_size(capital, risk_pct, sl_pips, 10)
    st.metric("Recommended Lot Size", f"{size:.2f} Units")
