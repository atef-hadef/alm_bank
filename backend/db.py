
import sqlite3
import pandas as pd
import uuid
import random
from datetime import datetime, timedelta

# Charger le dataset
csv_path = "D:/My_Projects/Nouveau dossier/alm-banking/backend/Structured_Banking_Risk_Real_Values.csv"
print(f"Tentative de lecture du fichier CSV à : {csv_path}")
data = pd.read_csv(csv_path)

# Remplacer les valeurs NULL par des valeurs par défaut
data = data.fillna({
    'Age': 0,
    'Estimated Income': 0,
    'Credit Card Balance': 0,
    'Bank Loans': 0,
    'Superannuation Savings': 0,
    'Saving Accounts': 0,
    'Properties Owned': 0,
    'Default_Risk': 0
})

# Calculer les ratios (comme dans le backend)
data['Debt_to_Income_Ratio'] = (data['Credit Card Balance'] + data['Bank Loans']) / data['Estimated Income'].replace(0, 1)  # Éviter division par 0
data['Savings_to_Debt_Ratio'] = (data['Superannuation Savings'] + data['Saving Accounts']) / \
                                (data['Credit Card Balance'] + data['Bank Loans'] + 1)

# Créer une connexion à la base de données SQLite
conn = sqlite3.connect("banking.db")
cursor = conn.cursor()

# Créer la table clients
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

# Générer des dates aléatoires entre 2015 et 2025
start_date = datetime(2015, 1, 1)
end_date = datetime(2025, 12, 31)
date_range = (end_date - start_date).days

# Générer des données pour remplir la table
for index, row in data.iterrows():
    client_id = str(uuid.uuid4())
    name = f"Client_{index + 1}"
    risk_level = "Élevé" if row['Default_Risk'] == 1 else "Faible"
    random_days = random.randint(0, date_range)
    joined_bank = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')

    cursor.execute('''
        INSERT INTO clients (
            Client_ID, Name, Age, Estimated_Income, Credit_Card_Balance, Bank_Loans,
            Superannuation_Savings, Saving_Accounts, Properties_Owned, Default_Risk,
            Debt_to_Income_Ratio, Savings_to_Debt_Ratio, Risk_Level, Joined_Bank
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        client_id, name, row['Age'], row['Estimated Income'], row['Credit Card Balance'],
        row['Bank Loans'], row['Superannuation Savings'], row['Saving Accounts'],
        row['Properties Owned'], row['Default_Risk'], row['Debt_to_Income_Ratio'],
        row['Savings_to_Debt_Ratio'], risk_level, joined_bank
    ))

# Valider les modifications et fermer la connexion
conn.commit()
conn.close()

print("Base de données SQLite créée et données importées avec succès.")