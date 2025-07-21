"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowUpRight, BarChart3, PieChartIcon, Search } from "lucide-react"

// Données mockées pour les clients et leurs risques
const mockClients = [
  { id: 1, name: "Banque Nationale", loanAmount: 5000000, depositAmount: 7500000, calculatedRisk: 0.35 },
  { id: 2, name: "Crédit Mutuel", loanAmount: 3500000, depositAmount: 4200000, calculatedRisk: 0.42 },
  { id: 3, name: "BNP Paribas", loanAmount: 8200000, depositAmount: 9100000, calculatedRisk: 0.28 },
  { id: 4, name: "Société Générale", loanAmount: 6100000, depositAmount: 5800000, calculatedRisk: 0.51 },
  { id: 5, name: "HSBC France", loanAmount: 4300000, depositAmount: 6200000, calculatedRisk: 0.33 },
  { id: 6, name: "Crédit Agricole", loanAmount: 7200000, depositAmount: 8500000, calculatedRisk: 0.31 },
]

// Données pour le graphique en camembert
const riskDistribution = [
  { name: "Risque Faible", value: 35 },
  { name: "Risque Modéré", value: 45 },
  { name: "Risque Élevé", value: 20 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

// Données pour le graphique d'évolution des risques
const riskTrends = [
  { month: "Jan", avgRisk: 0.32 },
  { month: "Fév", avgRisk: 0.35 },
  { month: "Mar", avgRisk: 0.33 },
  { month: "Avr", avgRisk: 0.38 },
  { month: "Mai", avgRisk: 0.41 },
  { month: "Juin", avgRisk: 0.39 },
]

export function RiskDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFrame, setTimeFrame] = useState("month")

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = mockClients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risque Moyen</CardTitle>
            <div className="h-4 w-4 text-emerald-600">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.37</div>
            <p className="text-xs text-muted-foreground">+2.5% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients à Risque Élevé</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Prêts</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.3M €</div>
            <p className="text-xs text-muted-foreground">+5.2% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Dépôts</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41.3M €</div>
            <p className="text-xs text-muted-foreground">+3.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Risque par Client</CardTitle>
              <Tabs defaultValue="bar" className="w-[160px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bar">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="pie">
                    <PieChartIcon className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>Niveau de risque calculé pour chaque client</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <TabsContent value="bar" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredClients}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calculatedRisk" fill="#10b981" name="Risque Calculé" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="pie" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Évolution des Risques</CardTitle>
            <CardDescription>Tendance du risque moyen sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskTrends}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgRisk" fill="#10b981" name="Risque Moyen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau récapitulatif */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des Clients à Risque</CardTitle>
          <CardDescription>Les clients avec les niveaux de risque les plus élevés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">Montant du Prêt</th>
                  <th className="px-4 py-3 text-left font-medium">Montant des Dépôts</th>
                  <th className="px-4 py-3 text-left font-medium">Risque Calculé</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients
                  .sort((a, b) => b.calculatedRisk - a.calculatedRisk)
                  .slice(0, 5)
                  .map((client) => (
                    <tr key={client.id} className="border-b">
                      <td className="px-4 py-3">{client.name}</td>
                      <td className="px-4 py-3">{client.loanAmount.toLocaleString()} €</td>
                      <td className="px-4 py-3">{client.depositAmount.toLocaleString()} €</td>
                      <td className="px-4 py-3">{client.calculatedRisk.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            client.calculatedRisk > 0.5
                              ? "bg-red-100 text-red-800"
                              : client.calculatedRisk > 0.3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {client.calculatedRisk > 0.5 ? "Élevé" : client.calculatedRisk > 0.3 ? "Modéré" : "Faible"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
