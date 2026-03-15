import streamlit as st

def show():
    st.header("🛠️ Strategy Builder")
    
    st.write("Drag and drop logic components to build your strategy.")
    
    with st.expander("Entry Conditions"):
        st.multiselect("Indicators", ["RSI", "MACD", "Bollinger Bands", "XGBoost Signal"])
        st.number_input("RSI Threshold <", 30)
    
    with st.expander("Exit Conditions"):
        st.number_input("Take Profit (%)", 2.0)
        st.number_input("Stop Loss (%)", 1.0)
        
    st.button("Save Strategy")
