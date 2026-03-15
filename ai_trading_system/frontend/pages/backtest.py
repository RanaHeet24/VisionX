import streamlit as st
import pandas as pd
from backend.engine.backtest import BacktestEngine

def show():
    st.header("🧪 Advanced Backtest Engine")
    
    col1, col2 = st.columns(2)
    with col1:
        symbol = st.selectbox("Select Asset", ["BTC/USDT", "ETH/USDT"])
        days = st.slider("Lookback Period (Days)", 30, 365, 90)
    with col2:
        initial_capital = st.number_input("Initial Capital", value=10000.0)
        slippage = st.slider("Simulated Slippage (bps)", 0, 50, 5)

    if st.button("Run Backtest"):
        st.info(f"Running simulation for {symbol}...")
        
        # Mocking Data for Demo
        dates = pd.date_range(end=pd.Timestamp.now(), periods=days)
        data = pd.DataFrame({
            'timestamp': dates,
            'close': [50000 + i*10 for i in range(days)], # linear trend
            'volume': [1000] * days
        })
        data.set_index('timestamp', inplace=True)
        
        # Simple Strategy (Buy and Hold)
        def strategy(row, context):
            if context['portfolio_value'] == context['capital']:
                return {"side": "BUY", "amount": 0.1, "symbol": symbol}
            return None

        engine = BacktestEngine(initial_capital=initial_capital)
        metrics = engine.run(data, strategy)
        
        st.success("Backtest Complete")
        
        m_col1, m_col2, m_col3 = st.columns(3)
        m_col1.metric("Total Return", f"{metrics['Total_Return']:.2%}")
        m_col2.metric("Sharpe Ratio", f"{metrics['Sharpe_Ratio']:.2f}")
        m_col3.metric("Max Drawdown", f"{metrics['Max_Drawdown']:.2%}")
        
        st.line_chart(metrics['Equity_Curve'])
