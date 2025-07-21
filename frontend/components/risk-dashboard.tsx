"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Define TypeScript interfaces for the data structure
interface RiskDistribution {
  name: string;
  value: number;
}

interface RiskTrend {
  year: string;
  avgRisk: number;
}

interface Client {
  Name: string;
  Age: number;
  Estimated_Income: number;
  Credit_Card_Balance: number;
  Bank_Loans: number;
  Superannuation_Savings: number;
  Saving_Accounts: number;
  Properties_Owned: number;
  Default_Risk: number;
  Debt_to_Income_Ratio: number;
  Savings_to_Debt_Ratio: number;
  Joined_Bank: string;
}

interface Pagination {
  total_clients: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface DashboardData {
  avg_risk: number;
  high_risk_clients: number;
  total_loans: number;
  total_deposits: number;
  risk_distribution: RiskDistribution[];
  risk_trends: RiskTrend[];
  clients: Client[];
  pagination: Pagination;
}

const RiskDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    avg_risk: 0,
    high_risk_clients: 0,
    total_loans: 0,
    total_deposits: 0,
    risk_distribution: [],
    risk_trends: [],
    clients: [],
    pagination: { total_clients: 0, page: 1, page_size: 10, total_pages: 1 },
  });
  const [allClients, setAllClients] = useState<Client[]>([]); // Store all clients
  const [filteredClients, setFilteredClients] = useState<Client[]>([]); // Store filtered clients
  const [filteredRiskDistribution, setFilteredRiskDistribution] = useState<RiskDistribution[]>([]);
  const [filteredAvgRisk, setFilteredAvgRisk] = useState<number>(0);
  const [filteredHighRiskClients, setFilteredHighRiskClients] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [clientType, setClientType] = useState<string>('Tous');
  const [minLoan, setMinLoan] = useState<number>(0);
  const [maxLoan, setMaxLoan] = useState<number>(2500000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all clients by setting a large pageSize
        const params = new URLSearchParams({
          page: "1",
          pageSize: "10000", // Large enough to fetch all clients
        });

        const response = await fetch(`http://localhost:8000/api/banking?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Échec de la récupération des données: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        setAllClients(result.clients); // Store all clients
        setFilteredClients(result.clients); // Initially, filtered clients are all clients
      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        setError(error.message || 'Une erreur est survenue lors de la récupération des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch only once on mount

  useEffect(() => {
    // Apply filters to allClients whenever filter criteria change
    let filtered = allClients;
    
    // Filtre par recherche (Name)
    if (search) {
      filtered = filtered.filter((client: Client) =>
        client.Name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtre par type de client (basé sur Default_Risk)
    if (clientType !== 'Tous') {
      filtered = filtered.filter((client: Client) =>
        clientType === 'Élevé' ? client.Default_Risk === 1 : client.Default_Risk === 0
      );
    }
    
    // Filtre par montant du prêt (Bank Loans)
    filtered = filtered.filter((client: Client) =>
      client.Bank_Loans >= minLoan && client.Bank_Loans <= maxLoan
    );

    // Mettre à jour les clients filtrés
    setFilteredClients(filtered);

    // Calculer la répartition des risques pour les clients filtrés
    const defaultCount = filtered.filter((client: Client) => client.Default_Risk === 1).length;
    const nonDefaultCount = filtered.filter((client: Client) => client.Default_Risk === 0).length;
    const filteredDistribution = [
      { name: "Non Défaut", value: nonDefaultCount },
      { name: "Défaut", value: defaultCount },
    ];
    setFilteredRiskDistribution(filteredDistribution);

    // Calculer les métriques filtrées
    const filteredAvgRisk = filtered.length > 0
      ? filtered.reduce((sum: number, client: Client) => sum + client.Default_Risk, 0) / filtered.length
      : 0;
    setFilteredAvgRisk(filteredAvgRisk);

    const filteredHighRisk = filtered.filter((client: Client) => client.Default_Risk === 1).length;
    setFilteredHighRiskClients(filteredHighRisk);
  }, [search, clientType, minLoan, maxLoan, allClients]);

  const formatNumber = (num: number): string => {
    return (num / 1000000).toFixed(2) + 'M €';
  };

  const resetFilters = () => {
    setSearch('');
    setClientType('Tous');
    setMinLoan(0);
    setMaxLoan(2500000);
  };

  const getRiskDistributionColors = () => {
    return ['#8884d8', '#ff8042'];
  };

  // Calculer les données pour le graphique en barres (Dette/Revenu par tranche d'âge)
  const ageGroupData = (() => {
    const ageGroups: { [key: string]: { total: number; count: number } } = {};
    filteredClients.forEach(client => {
      const ageGroup = `${Math.floor(client.Age / 10) * 10}-${Math.floor(client.Age / 10) * 10 + 9}`;
      if (!ageGroups[ageGroup]) {
        ageGroups[ageGroup] = { total: 0, count: 0 };
      }
      ageGroups[ageGroup].total += client.Debt_to_Income_Ratio;
      ageGroups[ageGroup].count += 1;
    });
    return Object.keys(ageGroups)
      .map(group => ({
        ageGroup: group,
        avgDebtToIncome: ageGroups[group].total / ageGroups[group].count,
      }))
      .sort((a, b) => parseInt(a.ageGroup) - parseInt(b.ageGroup));
  })();

  // Trouver un fait intéressant : Tranche d'âge avec le plus haut Debt_to_Income_Ratio
  const highestDebtToIncomeAgeGroup = ageGroupData.reduce((prev, current) =>
    prev.avgDebtToIncome > current.avgDebtToIncome ? prev : current,
    { ageGroup: "Aucune", avgDebtToIncome: 0 }
  );

  if (isLoading) {
    return (
      <div className="p-5 bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Tableau de bord des Risques</h1>
      </div>
      <div className="mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Rechercher un client (ex: Client 1)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 pl-8 border rounded-md bg-background border-border focus:outline-none focus:ring focus:ring-ring"
            />
            <svg className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className="p-2 border rounded-md bg-background border-border focus:outline-none focus:ring focus:ring-ring"
          >
            <option value="Tous">Tous</option>
            <option value="Élevé">Défaut</option>
            <option value="Faible">Non Défaut</option>
          </select>
          <input
            type="number"
            placeholder="Prêt min (€)"
            value={minLoan}
            onChange={(e) => setMinLoan(Number(e.target.value) || 0)}
            className="p-2 border rounded-md bg-background border-border focus:outline-none focus:ring focus:ring-ring w-32"
          />
          <input
            type="number"
            placeholder="Prêt max (€)"
            value={maxLoan}
            onChange={(e) => setMaxLoan(Number(e.target.value) || 2500000)}
            className="p-2 border rounded-md bg-background border-border focus:outline-none focus:ring focus:ring-ring w-32"
          />
          <button
            onClick={resetFilters}
            className="p-2 border rounded-md bg-background border-border hover:bg-accent"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-medium mb-2">Taux de Défaut Moyen (Filtré)</h3>
          <p className="text-2xl font-bold">{(filteredAvgRisk * 100).toFixed(2)}%</p>
          <small className="text-muted-foreground">Pourcentage de clients en défaut (filtré)</small>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-medium mb-2">Clients en Défaut (Filtré)</h3>
          <p className="text-2xl font-bold">{filteredHighRiskClients}</p>
          <small className="text-muted-foreground">Clients ayant fait défaut (filtré)</small>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-medium mb-2">Total des Prêts</h3>
          <p className="text-2xl font-bold">{formatNumber(data.total_loans)}</p>
          <small className="text-muted-foreground">Somme des prêts bancaires (total)</small>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-medium mb-2">Total des Dépôts</h3>
          <p className="text-2xl font-bold">{formatNumber(data.total_deposits)}</p>
          <small className="text-muted-foreground">Somme des comptes d'épargne (total)</small>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Répartition des Risques (Filtré)</h3>
          <p className="text-muted-foreground mb-4">Proportion des clients selon le risque de défaut</p>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredRiskDistribution}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              fill="#8884d8"
            >
              {filteredRiskDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskDistributionColors()[index % getRiskDistributionColors().length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Analyse des Ratios (Filtré)</h3>
          <p className="text-muted-foreground mb-4">Dette/Revenu vs Épargne/Dette</p>
          <ScatterChart width={400} height={300}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis type="number" dataKey="Debt_to_Income_Ratio" name="Dette/Revenu" stroke="hsl(var(--foreground))" domain={[0, 35]} />
            <YAxis type="number" dataKey="Savings_to_Debt_Ratio" name="Épargne/Dette" stroke="hsl(var(--foreground))" domain={[0, 10]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Scatter name="Non Défaut" data={filteredClients.filter(c => c.Default_Risk === 0)} fill="#8884d8" />
            <Scatter name="Défaut" data={filteredClients.filter(c => c.Default_Risk === 1)} fill="#ff8042" />
          </ScatterChart>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Dette/Revenu par Tranche d'Âge (Filtré)</h3>
          <p className="text-muted-foreground mb-4">Moyenne du ratio Dette/Revenu par groupe d'âge</p>
          <BarChart width={400} height={300} data={ageGroupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="ageGroup" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Bar dataKey="avgDebtToIncome" name="Dette/Revenu Moyen" fill="hsl(var(--chart-1))" />
          </BarChart>
        </div>
      </div>
      <div className="bg-card text-card-foreground p-5 rounded-lg shadow-md mb-5">
        <h3 className="text-lg font-semibold mb-2">Fait Intéressant (Filtré)</h3>
        <p className="text-muted-foreground">
          Le groupe d'âge {highestDebtToIncomeAgeGroup.ageGroup} a le ratio Dette/Revenu moyen le plus élevé ({highestDebtToIncomeAgeGroup.avgDebtToIncome.toFixed(2)}) parmi les clients filtrés, indiquant un risque financier potentiellement plus élevé.
        </p>
      </div>
    </div>
  );
};

export default RiskDashboard;