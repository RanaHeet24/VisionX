from sqlalchemy import Column, String, Float, DateTime, MetaData
from sqlalchemy.orm import declarative_base

Base = declarative_base()
metadata = MetaData()

class Candle(Base):
    __tablename__ = 'candles'

    timestamp = Column(DateTime(timezone=True), primary_key=True)
    symbol = Column(String, primary_key=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    exchange = Column(String, primary_key=True)
    timeframe = Column(String, primary_key=True)
