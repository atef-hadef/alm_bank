# 🤖 Système de Visualisation & Prédiction de Risque Client Bancaire

Ce projet est une application web complète permettant à une banque de :

1. 📊 Visualiser dynamiquement les données de ses clients
2. 🧠 Prédire automatiquement le risque d'un nouveau client souhaitant contracter un prêt, à l’aide d’un **modèle Machine Learning** intégré
3. 💡 Prendre des décisions plus intelligentes grâce à l’analyse de données historiques

---

## 🎯 Objectifs

- Offrir une **interface web moderne** (TypeScript / React) pour interagir avec les données.
- Intégrer un **modèle prédictif ML** (ex. : classification binaire « Risqué » / « Non Risqué »).
- Automatiser le traitement des données client (upload, nettoyage, scoring).
- Permettre la **prise de décision rapide** pour les gestionnaires de crédit.

---


## ⚙️ Technologies utilisées

| Composant      | Stack                                |
|----------------|--------------------------------------|
| 🖥️ Frontend     | TypeScript + React + Bootstrap       |
| 🧠 Modèle ML     | Python (scikit-learn )     |
| 🔌 Backend API  | FastAPI                     |
| 📦 Format modèle | Pickle                      |
| 📊 Visualisation | Plotly / Chart.js         |

---

## 🔍 Fonctionnalités clés

- 📂 Upload des données client (CSV ou formulaire React)
- 📈 Visualisation des statistiques : âge, revenus, historique de crédit, etc.
- 🤖 Prédiction de risque basée sur modèle ML :
  - Entrée : données client (age, revenu, situation pro, etc.)
  - Sortie : Risque (`Oui` / `Non`) + Probabilité

---

## 🚀 Lancer le projet

### 🧠 Côté backend (ML + API)
```bash
cd backend/
pip install -r requirements.txt
python app.py
🖥️ Côté frontend

cd frontend/
npm install
npm run dev
Accès
Frontend : http://localhost:3000
Backend API : http://localhost:8000 

📚 Exemple d'utilisation
L’agent de crédit ouvre le site.

Il saisit les données d’un nouveau client ou importe un fichier.

L’application prédit si le client est à risque ou non.

Il peut visualiser des indicateurs clés et prendre sa décision.

🧠 Machine Learning
Modèle : Classification (Random Forest / XGBoost / Logistic Regression)

Données : Historiques de clients (ex. : âge, revenu, emploi, remboursement)

Évaluation : AUC, F1-score, Recall

🏁 Prochaine amélioration
🔐 Authentification (agents uniquement)

📊 Tableau de bord global (analyse population)

🧠 MLOps / AutoML (entraînement automatisé, monitoring)

🧾 Export des prédictions en PDF

👨‍💻 Réalisé par
Nom : Hadef Atef

🎓 Étudiant en Data Science & IA

📫 Email : benhadefatef@gmail.com
linkedIn : www.linkedin.com/in/atef-ben-hadef-810aa4292
