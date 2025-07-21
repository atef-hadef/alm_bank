from sqlalchemy.orm import Session
import models

# Récupérer tous les clients de la base de données
def get_clients(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Client).offset(skip).limit(limit).all()

# Exemple de récupération de la tendance des risques
def get_risk_trends(db: Session):
    return [
        {"year": "2020", "avgRisk": 2.0},
        {"year": "2021", "avgRisk": 2.5},
        {"year": "2022", "avgRisk": 3.0},
    ]
