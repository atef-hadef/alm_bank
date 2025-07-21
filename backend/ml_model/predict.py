import pickle
from pathlib import Path

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.load_model()
        
    def load_model(self):
        model_path = Path(__file__).parent / "default_risk_model_rf.pkl"
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
    
    def predict(self, data: dict) -> float:
        # Adaptez cette partie à votre modèle
        features = [
            data['age'],
            data['income'],
            data['credit_score']
        ]
        return self.model.predict([features])[0]