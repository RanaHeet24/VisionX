import xgboost as xgb
import numpy as np
import pandas as pd
from typing import List, Tuple
import joblib
import logging
from scipy.stats import ks_2samp

logger = logging.getLogger(__name__)

class AdaptiveModel:
    def __init__(self, model_path: str = "models/xgb_model.json"):
        self.model = None
        self.model_path = model_path
        self.params = {
            'objective': 'binary:logistic',
            'eval_metric': 'logloss',
            'eta': 0.1,
            'max_depth': 5
        }
        self.feature_names = []
        
    def train(self, X: pd.DataFrame, y: pd.Series):
        """Initial training."""
        self.feature_names = X.columns.tolist()
        dtrain = xgb.DMatrix(X, label=y, feature_names=self.feature_names)
        self.model = xgb.train(self.params, dtrain, num_boost_round=100)
        self.save()

    def update(self, X_new: pd.DataFrame, y_new: pd.Series):
        """
        Online update (Mini-batch retraining).
        XGBoost supports 'process_type': 'update' to refresh leaf values, 
        or we can add new trees.
        """
        if not self.model:
            self.train(X_new, y_new)
            return

        dtrain = xgb.DMatrix(X_new, label=y_new, feature_names=self.feature_names)
        # Update existing trees (refresh leaf values)
        # params_update = self.params.copy()
        # params_update.update({'process_type': 'update', 'updater': 'refresh', 'refresh_leaf': True})
        
        # Incremental learning: continue training from previous model
        self.model = xgb.train(self.params, dtrain, num_boost_round=10, xgb_model=self.model)
        self.save()

    def predict(self, X: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        if not self.model:
            return np.zeros(len(X)), np.zeros(len(X))
        
        dtest = xgb.DMatrix(X, feature_names=self.feature_names)
        probs = self.model.predict(dtest)
        preds = (probs > 0.5).astype(int)
        return preds, probs

    def save(self):
        if self.model:
            self.model.save_model(self.model_path)

    def load(self):
        self.model = xgb.Booster()
        self.model.load_model(self.model_path)

class DriftDetector:
    def __init__(self, reference_data: np.ndarray):
        self.reference_data = reference_data  # Baseline distribution (e.g., training set predictions)

    def check_drift(self, current_data: np.ndarray, threshold: float = 0.05) -> bool:
        """
        Perform KS-Test to detect concept drift.
        Returns True if drift detected (p-value < threshold).
        """
        statistic, p_value = ks_2samp(self.reference_data, current_data)
        logger.info(f"Drift Check: p-value={p_value:.4f}, stat={statistic:.4f}")
        return p_value < threshold

# Usage
# detector = DriftDetector(initial_probs)
# if detector.check_drift(recent_probs):
#     model.retrain(...)
