from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    loanAmount = Column(Float)
    depositAmount = Column(Float)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    contactPerson = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    age = Column(Float)
    score_credit = Column(Float)
    delai_paiement_moyen = Column(Float)
    nb_incidents_paiement = Column(Float)
    lastUpdated = Column(String)
    calculatedRisk = Column(Float)
    riskLevel = Column(String)
    debt_to_income_ratio = Column(Float)  # New field
    savings_to_debt_ratio = Column(Float)  # New field