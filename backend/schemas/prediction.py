from pydantic import BaseModel

class PredictionRequest(BaseModel):
    age: int
    income: float
    credit_score: int
    account_balance: float
    loan_amount: float