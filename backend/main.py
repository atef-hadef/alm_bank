from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import pickle
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import traceback
from datetime import datetime, timedelta

# Initialiser l'application FastAPI
app = FastAPI()

# Configurer CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle et le scaler
try:
    with open("default_risk_model_rf.pkl", "rb") as model_file:
        model = pickle.load(model_file)
    with open("scaler.pkl", "rb") as scaler_file:
        scaler = pickle.load(scaler_file)
except Exception as e:
    raise Exception(f"Erreur lors du chargement des fichiers .pkl : {str(e)}")

# Définir les noms des caractéristiques
FEATURE_NAMES = [
    "Age",
    "Estimated Income",
    "Credit Card Balance",
    "Bank Loans",
    "Superannuation Savings",
    "Saving Accounts",
    "Properties Owned",
    "Debt_to_Income_Ratio",
    "Savings_to_Debt_Ratio"
]

# Schéma des données d'entrée pour la prédiction
class ClientCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    age: int
    estimatedIncome: float
    creditCardBalance: float
    bankLoans: float
    superannuationSavings: float
    savingAccounts: float
    propertiesOwned: int
    lastUpdated: str

# Schéma de la réponse pour la prédiction
class ClientResponse(BaseModel):
    name: str
    email: Optional[str]
    phone: Optional[str]
    age: int
    estimatedIncome: float
    creditCardBalance: float
    bankLoans: float
    superannuationSavings: float
    savingAccounts: float
    propertiesOwned: int
    defaultRisk: int
    debt_to_income_ratio: Optional[float]
    savings_to_debt_ratio: Optional[float]
    lastUpdated: str

# Schémas pour les données du tableau de bord
class RiskDistribution(BaseModel):
    name: str
    value: int

class RiskTrend(BaseModel):
    year: str
    avgRisk: float

class Client(BaseModel):
    Name: str
    Age: int
    Estimated_Income: float
    Credit_Card_Balance: float
    Bank_Loans: float
    Superannuation_Savings: float
    Saving_Accounts: float
    Properties_Owned: int
    Default_Risk: int
    Debt_to_Income_Ratio: float
    Savings_to_Debt_Ratio: float
    Joined_Bank: str

class Pagination(BaseModel):
    total_clients: int
    page: int
    page_size: int
    total_pages: int

class DashboardData(BaseModel):
    avg_risk: float
    high_risk_clients: int
    total_loans: float
    total_deposits: float
    risk_distribution: List[RiskDistribution]
    risk_trends: List[RiskTrend]
    clients: List[Client]
    pagination: Pagination

# Endpoint pour prédire le risque d'un client
@app.post("/api/clients", response_model=ClientResponse)
async def create_client(client: ClientCreate):
    try:
        print("Données reçues:", client.dict())
        if client.age < 18:
            raise HTTPException(status_code=422, detail="L'âge doit être supérieur ou égal à 18 ans")
        if client.estimatedIncome <= 0:
            raise HTTPException(status_code=422, detail="Le revenu estimé doit être supérieur à 0")
        if client.creditCardBalance < 0:
            raise HTTPException(status_code=422, detail="Le solde de la carte de crédit ne peut pas être négatif")
        if client.bankLoans < 0:
            raise HTTPException(status_code=422, detail="Le montant du prêt ne peut pas être négatif")
        if client.superannuationSavings < 0:
            raise HTTPException(status_code=422, detail="L'épargne de retraite ne peut pas être négative")
        if client.savingAccounts < 0:
            raise HTTPException(status_code=422, detail="Le compte d'épargne ne peut pas être négatif")
        if client.propertiesOwned < 0:
            raise HTTPException(status_code=422, detail="Le nombre de propriétés ne peut pas être négatif")

        total_debt = client.bankLoans + client.creditCardBalance
        debt_to_income_ratio = None
        savings_to_debt_ratio = None

        if client.estimatedIncome > 0:
            debt_to_income_ratio = total_debt / client.estimatedIncome
        else:
            raise HTTPException(status_code=422, detail="Impossible de calculer Debt_to_Income_Ratio : revenu estimé est 0")

        total_savings = client.superannuationSavings + client.savingAccounts
        savings_to_debt_ratio = total_savings / (total_debt + 1)

        features = {
            "Age": client.age,
            "Estimated Income": client.estimatedIncome,
            "Credit Card Balance": client.creditCardBalance,
            "Bank Loans": client.bankLoans,
            "Superannuation Savings": client.superannuationSavings,
            "Saving Accounts": client.savingAccounts,
            "Properties Owned": client.propertiesOwned,
            "Debt_to_Income_Ratio": debt_to_income_ratio if debt_to_income_ratio is not None else 0,
            "Savings_to_Debt_Ratio": savings_to_debt_ratio
        }

        print("Caractéristiques préparées:", features)

        features_df = pd.DataFrame([features], columns=FEATURE_NAMES)
        print("DataFrame des caractéristiques:", features_df.to_dict())

        features_scaled = scaler.transform(features_df)
        print("Caractéristiques normalisées:", features_scaled)

        default_risk = model.predict(features_scaled)[0]
        print("Prédiction Default_Risk:", default_risk)

        response = ClientResponse(
            name=client.name,
            email=client.email,
            phone=client.phone,
            age=client.age,
            estimatedIncome=client.estimatedIncome,
            creditCardBalance=client.creditCardBalance,
            bankLoans=client.bankLoans,
            superannuationSavings=client.superannuationSavings,
            savingAccounts=client.savingAccounts,
            propertiesOwned=client.propertiesOwned,
            defaultRisk=int(default_risk),
            debt_to_income_ratio=debt_to_income_ratio,
            savings_to_debt_ratio=savings_to_debt_ratio,
            lastUpdated=client.lastUpdated
        )

        return response

    except Exception as e:
        print(f"Erreur lors du traitement : {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))

# Endpoint pour récupérer les données du tableau de bord
@app.get("/api/banking", response_model=DashboardData)
async def get_banking_data(page: int = 1, pageSize: int = 10):
    try:
        # Charger les données depuis le CSV
        df = pd.read_csv("Structured_Banking_Risk_Real_Values.csv")

        # Générer les champs manquants
        df['Name'] = [f"Client {i+1}" for i in range(len(df))]
        
        # Générer une date d'adhésion aléatoire (entre 2015 et 2025) pour les tendances
        start_date = datetime(2015, 1, 1)
        end_date = datetime(2025, 5, 16)
        days_range = (end_date - start_date).days
        df['Joined_Bank'] = [
            (start_date + timedelta(days=np.random.randint(0, days_range))).strftime('%Y-%m-%d')
            for _ in range(len(df))
        ]

        # Pagination
        total_clients = len(df)
        total_pages = (total_clients + pageSize - 1) // pageSize if total_clients > 0 else 1
        start_idx = (page - 1) * pageSize
        end_idx = start_idx + pageSize
        paginated_df = df.iloc[start_idx:end_idx]

        # Créer la liste des clients
        clients = [
            Client(
                Name=row['Name'],
                Age=int(row['Age']),
                Estimated_Income=float(row['Estimated Income']),
                Credit_Card_Balance=float(row['Credit Card Balance']),
                Bank_Loans=float(row['Bank Loans']),
                Superannuation_Savings=float(row['Superannuation Savings']),
                Saving_Accounts=float(row['Saving Accounts']),
                Properties_Owned=int(row['Properties Owned']),
                Default_Risk=int(row['Default_Risk']),
                Debt_to_Income_Ratio=float(row['Debt_to_Income_Ratio']),
                Savings_to_Debt_Ratio=float(row['Savings_to_Debt_Ratio']),
                Joined_Bank=row['Joined_Bank']
            )
            for _, row in paginated_df.iterrows()
        ]

        # Calculer les métriques agrégées
        avg_risk = df['Default_Risk'].mean() if not df.empty else 0.0
        total_loans = df['Bank Loans'].sum() if not df.empty else 0.0
        total_deposits = df['Saving Accounts'].sum() if not df.empty else 0.0
        high_risk_clients = len(df[df['Default_Risk'] == 1]) if not df.empty else 0

        # Calculer la répartition des risques (basée sur Default_Risk)
        risk_distribution_data = df['Default_Risk'].value_counts().to_dict()
        risk_distribution = [
            RiskDistribution(name="Non Défaut" if key == 0 else "Défaut", value=int(value))
            for key, value in risk_distribution_data.items()
        ]
        if not risk_distribution:
            risk_distribution = [
                RiskDistribution(name="Non Défaut", value=0),
                RiskDistribution(name="Défaut", value=0)
            ]

        # Calculer les tendances des risques par année
        df['Year'] = pd.to_datetime(df['Joined_Bank']).dt.year
        risk_trends_data = df.groupby('Year')['Default_Risk'].mean().reset_index()
        risk_trends = [
            RiskTrend(year=str(int(row['Year'])), avgRisk=float(row['Default_Risk']))
            for _, row in risk_trends_data.iterrows()
        ]
        if not risk_trends:
            current_year = datetime.now().strftime('%Y')
            risk_trends = [RiskTrend(year=current_year, avgRisk=0.0)]

        # Construire la réponse
        response = DashboardData(
            avg_risk=float(avg_risk),
            high_risk_clients=int(high_risk_clients),
            total_loans=float(total_loans),
            total_deposits=float(total_deposits),
            risk_distribution=risk_distribution,
            risk_trends=risk_trends,
            clients=clients,
            pagination=Pagination(
                total_clients=total_clients,
                page=page,
                page_size=pageSize,
                total_pages=total_pages
            )
        )
        print(f"Réponse envoyée : {response.dict()}")
        return response

    except Exception as e:
        print(f"Erreur lors de la récupération des données : {str(e)}")
        print("Traceback complet :")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint de test pour vérifier que l'API fonctionne
@app.get("/")
async def root():
    return {"message": "API is running"}