import streamlit as st
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

st.set_page_config(
    page_title="AI Trading Platform",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🚀 Vision X")

st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Dashboard", "Strategy Builder", "Backtest Engine", "Risk Analytics"])

if page == "Dashboard":
    from frontend.pages import dashboard
    dashboard.show()
elif page == "Strategy Builder":
    from frontend.pages import strategy_builder
    strategy_builder.show()
elif page == "Backtest Engine":
    from frontend.pages import backtest
    backtest.show()
elif page == "Risk Analytics":
    from frontend.pages import risk_analytics
    risk_analytics.show()
