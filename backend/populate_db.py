import pandas as pd
import sqlite3
import uuid
from datetime import datetime, timedelta
import numpy as np

def populate_database():
    try:
        # Connexion à la base de données
        conn = sqlite3.connect("banking.db")
        cursor = conn.cursor()

        # Créer la table 'clients' si elle n'existe pas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clients (
                Client_ID TEXT PRIMARY KEY,
                Name TEXT,
                Age INTEGER,
                Estimated_Income REAL,
                Credit_Card_Balance REAL,
                Bank_Loans REAL,
                Superannuation_Savings REAL,
                Saving_Accounts REAL,
                Properties_Owned INTEGER,
                Default_Risk INTEGER,
                Debt_to_Income_Ratio REAL,
                Savings_to_Debt_Ratio REAL,
                Risk_Level TEXT,
                Joined_Bank TEXT
            )
        ''')

        # Vider la table existante
        cursor.execute("DELETE FROM clients")
        csv_path = "D:/My_Projects/Nouveau dossier/alm-banking/backend/Structured_Banking_Risk_Real_Values.csv"
        

        # Charger les données depuis le CSV
        df = pd.read_csv(csv_path)

        for index, row in df.iterrows():
            # Calculer Debt_to_Income_Ratio
            total_debt = row['Bank Loans'] + row['Credit Card Balance']
            debt_to_income_ratio = total_debt / row['Estimated Income'] if row['Estimated Income'] > 0 else 0

            # Calculer Savings_to_Debt_Ratio
            total_savings = row['Superannuation Savings'] + row['Saving Accounts']
            savings_to_debt_ratio = total_savings / (total_debt + 1)

            # Déterminer Risk_Level
            risk_level = "Élevé" if debt_to_income_ratio > 5 else "Faible"

            # Générer Client_ID et Name
            client_id = str(uuid.uuid4())
            name = f"Client {index + 1}"

            # Générer une date d'adhésion aléatoire
            start_date = datetime(2015, 1, 1)
            end_date = datetime(2025, 5, 16)
            days_range = (end_date - start_date).days
            random_days = np.random.randint(0, days_range)
            joined_bank = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')

            # Insérer les données
            cursor.execute('''
                INSERT INTO clients (
                    Client_ID, Name, Age, Estimated_Income, Credit_Card_Balance, Bank_Loans,
                    Superannuation_Savings, Saving_Accounts, Properties_Owned, Default_Risk,
                    Debt_to_Income_Ratio, Savings_to_Debt_Ratio, Risk_Level, Joined_Bank
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                client_id,
                name,
                int(row['Age']),
                float(row['Estimated Income']),
                float(row['Credit Card Balance']),
                float(row['Bank Loans']),
                float(row['Superannuation Savings']),
                float(row['Saving Accounts']),
                int(row['Properties Owned']),
                int(row['Default_Risk']),
                float(debt_to_income_ratio),
                float(savings_to_debt_ratio),
                risk_level,
                joined_bank
            ))

        conn.commit()
        print(f"Base de données peuplée avec succès : {len(df)} clients insérés.")
    except Exception as e:
        print(f"Erreur lors du peuplement de la base de données : {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    populate_database()