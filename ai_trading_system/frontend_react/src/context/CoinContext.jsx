import React, { createContext, useContext, useState, useEffect } from 'react';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
    const [selectedCoin, setSelectedCoin] = useState(() => {
        // Initialize from localStorage if available, else default to bitcoin
        return localStorage.getItem('selectedCoin') || 'bitcoin';
    });

    useEffect(() => {
        localStorage.setItem('selectedCoin', selectedCoin);
    }, [selectedCoin]);

    return (
        <CoinContext.Provider value={{ selectedCoin, setSelectedCoin }}>
            {children}
        </CoinContext.Provider>
    );
};

export const useCoin = () => {
    const context = useContext(CoinContext);
    if (!context) {
        throw new Error('useCoin must be used within a CoinProvider');
    }
    return context;
};
