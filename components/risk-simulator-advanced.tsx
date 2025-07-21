"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, BookmarkPlus, Download, LineChartIcon, Save, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
type Client = {
  id: number
  name: string
  type: string
  loanAmount: number
  depositAmount: number
  calculatedRisk: number
  lastUpdated: string
}

type ScenarioResult = {
  clientId: number
  clientName: string
  riskBefore: number
  riskAfter: number
  impact: number
  status: "improved" | "worsened" | "unchanged"
}

type Scenario = {
  id: number
  name: string
  description: string
  interestRateChange: number
  loanAmountChange: number
  depositAmountChange: number
  marketVolatility: number
  economicGrowth: number
  results: ScenarioResult[]
  timestamp: string
}

// Données mockées pour les clients
const mockClients = [
  {
    id: 1,
    name: "Banque Nationale",
    type: "Banque",
    loanAmount: 5000000,
    depositAmount: 7500000,
    calculatedRisk: 0.35,
    lastUpdated: "2023-04-15",
  },
  {
    id: 2,
    name: "Crédit Mutuel",
    type: "Banque",
    loanAmount: 3500000,
    depositAmount: 4200000,
    calculatedRisk: 0.42,
    lastUpdated: "2023-04-12",
  },
  {
    id: 3,
    name: "BNP Paribas",
    type: "Banque",
    loanAmount: 8200000,
    depositAmount: 9100000,
    calculatedRisk: 0.28,
    lastUpdated: "2023-04-10",
  },
  {
    id: 4,
    name: "Société Générale",
    type: "Banque",
    loanAmount: 6100000,
    depositAmount: 5800000,
    calculatedRisk: 0.51,
    lastUpdated: "2023-04-08",
  },
  {
    id: 5,
    name: "HSBC France",
    type: "Banque",
    loanAmount: 4300000,
    depositAmount: 6200000,
    calculatedRisk: 0.33,
    lastUpdated: "2023-04-05",
  },
  {
    id: 6,
    name: "Crédit Agricole",
    type: "Banque",
    loanAmount: 7200000,
    depositAmount: 8500000,
    calculatedRisk: 0.31,
    lastUpdated: "2023-04-03",
  },
]

// Données mockées pour les scénarios sauvegardés
const savedScenarios: Scenario[] = [
  {
    id: 1,
    name: "Hausse des taux d'intérêt",
    description: "Simulation d'une hausse des taux d'intérêt de 2% avec stabilité des autres facteurs",
    interestRateChange: 2,
    loanAmountChange: 0,
    depositAmountChange: 0,
    marketVolatility: 0.5,
    economicGrowth: 1.2,
    results: [
      {
        clientId: 1,
        clientName: "Banque Nationale",
        riskBefore: 0.35,
        riskAfter: 0.42,
        impact: 20,
        status: "worsened",
      },
      { clientId: 2, clientName: "Crédit Mutuel", riskBefore: 0.42, riskAfter: 0.48, impact: 14.3, status: "worsened" },
      { clientId: 3, clientName: "BNP Paribas", riskBefore: 0.28, riskAfter: 0.33, impact: 17.9, status: "worsened" },
    ],
    timestamp: "2023-04-20",
  },
  {
    id: 2,
    name: "Crise économique",
    description: "Simulation d'une crise économique avec baisse des dépôts et hausse de la volatilité",
    interestRateChange: 1.5,
    loanAmountChange: 5,
    depositAmountChange: -15,
    marketVolatility: 0.8,
    economicGrowth: -0.5,
    results: [
      {
        clientId: 1,
        clientName: "Banque Nationale",
        riskBefore: 0.35,
        riskAfter: 0.52,
        impact: 48.6,
        status: "worsened",
      },
      { clientId: 2, clientName: "Crédit Mutuel", riskBefore: 0.42, riskAfter: 0.61, impact: 45.2, status: "worsened" },
      { clientId: 3, clientName: "BNP Paribas", riskBefore: 0.28, riskAfter: 0.45, impact: 60.7, status: "worsened" },
    ],
    timestamp: "2023-04-18",
  },
]

// Fonction pour simuler l'impact des changements sur le risque
const simulateRisk = (
  client: Client,
  interestRateChange: number,
  loanAmountChange: number,
  depositAmountChange: number,
  marketVolatility: number,
  economicGrowth: number,
): number => {
  // Facteurs d'impact pour chaque paramètre
  const interestRateImpact = interestRateChange * 0.035 // 1% de changement de taux = 0.035 d'impact sur le risque
  const loanImpact = (loanAmountChange / 100) * 0.02 // 1% de changement de prêt = 0.02 d'impact sur le risque
  const depositImpact = (depositAmountChange / 100) * -0.015 // 1% de changement de dépôt = -0.015 d'impact sur le risque
  const volatilityImpact = marketVolatility * 0.05 // Impact de la volatilité du marché
  const growthImpact = economicGrowth * -0.02 // Impact de la croissance économique (négatif car une croissance positive réduit le risque)

  // Calculer le nouveau risque en tenant compte de tous les facteurs
  let newRisk =
    client.calculatedRisk + interestRateImpact + loanImpact + depositImpact + volatilityImpact + growthImpact

  // S'assurer que le risque reste dans les limites raisonnables (0-1)
  newRisk = Math.max(0, Math.min(1, newRisk))

  return Number.parseFloat(newRisk.toFixed(2))
}

export function RiskSimulator() {
  const { toast } = useToast()
  const [selectedClients, setSelectedClients] = useState<number[]>([1, 2, 3]) // IDs des clients sélectionnés par défaut
  const [interestRateChange, setInterestRateChange] = useState<number>(0)
  const [loanAmountChange, setLoanAmountChange] = useState<number>(0)
  const [depositAmountChange, setDepositAmountChange] = useState<number>(0)
  const [marketVolatility, setMarketVolatility] = useState<number>(0.5)
  const [economicGrowth, setEconomicGrowth] = useState<number>(1.5)
  const [scenarioName, setScenarioName] = useState<string>("")
  const [scenarioDescription, setScenarioDescription] = useState<string>("")
  const [simulationResults, setSimulationResults] = useState<ScenarioResult[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>(savedScenarios)
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([])
  const [chartType, setChartType] = useState<"bar" | "line" | "composed">("bar")
  const [isSimulated, setIsSimulated] = useState<boolean>(false)

  // Filtrer les clients sélectionnés
  const selectedClientsData = mockClients.filter((client) => selectedClients.includes(client.id))

  // Fonction pour exécuter la simulation
  const runSimulation = () => {
    const results: ScenarioResult[] = selectedClientsData.map((client) => {
      const riskAfter = simulateRisk(
        client,
        interestRateChange,
        loanAmountChange,
        depositAmountChange,
        marketVolatility,
        economicGrowth,
      )
      const impact = Number.parseFloat((((riskAfter - client.calculatedRisk) / client.calculatedRisk) * 100).toFixed(1))

      return {
        clientId: client.id,
        clientName: client.name,
        riskBefore: client.calculatedRisk,
        riskAfter,
        impact,
        status:
          riskAfter > client.calculatedRisk ? "worsened" : riskAfter < client.calculatedRisk ? "improved" : "unchanged",
      }
    })

    setSimulationResults(results)
    setIsSimulated(true)

    toast({
      title: "Simulation terminée",
      description: "Les résultats de la simulation ont été calculés avec succès.",
    })
  }

  // Fonction pour sauvegarder un scénario
  const saveScenario = () => {
    if (!scenarioName) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre scénario avant de l'enregistrer.",
        variant: "destructive",
      })
      return
    }

    if (!isSimulated) {
      toast({
        title: "Erreur",
        description: "Veuillez exécuter une simulation avant d'enregistrer le scénario.",
        variant: "destructive",
      })
      return
    }

    const newScenario: Scenario = {
      id: scenarios.length > 0 ? Math.max(...scenarios.map((s) => s.id)) + 1 : 1,
      name: scenarioName,
      description: scenarioDescription,
      interestRateChange,
      loanAmountChange,
      depositAmountChange,
      marketVolatility,
      economicGrowth,
      results: simulationResults,
      timestamp: new Date().toISOString().split("T")[0],
    }

    setScenarios([...scenarios, newScenario])
    setSelectedScenarios([...selectedScenarios, newScenario.id])

    toast({
      title: "Scénario enregistré",
      description: `Le scénario "${scenarioName}" a été enregistré avec succès.`,
    })
  }

  // Fonction pour charger un scénario
  const loadScenario = (scenarioId: number) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    setInterestRateChange(scenario.interestRateChange)
    setLoanAmountChange(scenario.loanAmountChange)
    setDepositAmountChange(scenario.depositAmountChange)
    setMarketVolatility(scenario.marketVolatility)
    setEconomicGrowth(scenario.economicGrowth)
    setScenarioName(scenario.name)
    setScenarioDescription(scenario.description)
    setSimulationResults(scenario.results)
    setIsSimulated(true)

    toast({
      title: "Scénario chargé",
      description: `Le scénario "${scenario.name}" a été chargé avec succès.`,
    })
  }

  // Fonction pour gérer la sélection/désélection des scénarios pour comparaison
  const toggleScenarioSelection = (scenarioId: number) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter((id) => id !== scenarioId))
    } else {
      if (selectedScenarios.length < 3) {
        setSelectedScenarios([...selectedScenarios, scenarioId])
      } else {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez comparer que 3 scénarios à la fois.",
          variant: "destructive",
        })
      }
    }
  }

  // Préparer les données pour les graphiques de comparaison
  const prepareComparisonData = () => {
    if (selectedScenarios.length === 0) return []

    const selectedScenariosData = scenarios.filter((scenario) => selectedScenarios.includes(scenario.id))

    // Créer un ensemble de tous les clients présents dans les scénarios sélectionnés
    const allClientIds = new Set<number>()
    selectedScenariosData.forEach((scenario) => {
      scenario.results.forEach((result) => {
        allClientIds.add(result.clientId)
      })
    })

    // Préparer les données pour chaque client
    const comparisonData: any[] = []
    allClientIds.forEach((clientId) => {
      const client = mockClients.find((c) => c.id === clientId)
      if (!client) return

      const dataPoint: any = {
        clientName: client.name,
        riskBefore: client.calculatedRisk,
      }

      selectedScenariosData.forEach((scenario) => {
        const result = scenario.results.find((r) => r.clientId === clientId)
        if (result) {
          dataPoint[`${scenario.name}`] = result.riskAfter
        }
      })

      comparisonData.push(dataPoint)
    })

    return comparisonData
  }

  // Préparer les données pour le graphique d'impact
  const prepareImpactData = () => {
    if (simulationResults.length === 0) return []

    return simulationResults.map((result) => ({
      clientName: result.clientName,
      impact: result.impact,
      status: result.status,
    }))
  }

  // Données pour les graphiques
  const comparisonData = prepareComparisonData()
  const impactData = prepareImpactData()

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Panneau de configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Paramètres de simulation</CardTitle>
            <CardDescription>
              Ajustez les paramètres économiques pour simuler leur impact sur les profils de risque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Clients à analyser</Label>
                <div className="mt-2 space-y-2">
                  {mockClients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedClients([...selectedClients, client.id])
                          } else {
                            setSelectedClients(selectedClients.filter((id) => id !== client.id))
                          }
                        }}
                      />
                      <Label htmlFor={`client-${client.id}`} className="font-normal">
                        {client.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="interest-rate">Variation des taux d&apos;intérêt (%)</Label>
                  <span className="text-sm text-muted-foreground">{interestRateChange}%</span>
                </div>
                <Slider
                  id="interest-rate"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={[interestRateChange]}
                  onValueChange={(value) => setInterestRateChange(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="loan-amount">Variation des prêts (%)</Label>
                  <span className="text-sm text-muted-foreground">{loanAmountChange}%</span>
                </div>
                <Slider
                  id="loan-amount"
                  min={-20}
                  max={20}
                  step={1}
                  value={[loanAmountChange]}
                  onValueChange={(value) => setLoanAmountChange(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deposit-amount">Variation des dépôts (%)</Label>
                  <span className="text-sm text-muted-foreground">{depositAmountChange}%</span>
                </div>
                <Slider
                  id="deposit-amount"
                  min={-20}
                  max={20}
                  step={1}
                  value={[depositAmountChange]}
                  onValueChange={(value) => setDepositAmountChange(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="market-volatility">Volatilité du marché (0-1)</Label>
                  <span className="text-sm text-muted-foreground">{marketVolatility}</span>
                </div>
                <Slider
                  id="market-volatility"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[marketVolatility]}
                  onValueChange={(value) => setMarketVolatility(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="economic-growth">Croissance économique (%)</Label>
                  <span className="text-sm text-muted-foreground">{economicGrowth}%</span>
                </div>
                <Slider
                  id="economic-growth"
                  min={-3}
                  max={5}
                  step={0.1}
                  value={[economicGrowth]}
                  onValueChange={(value) => setEconomicGrowth(value[0])}
                />
              </div>
            </div>

            <Button onClick={runSimulation} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Exécuter la simulation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Résultats de la simulation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Résultats de la simulation</CardTitle>
                <CardDescription>
                  Visualisez l&apos;impact des paramètres économiques sur les profils de risque des clients.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={chartType} onValueChange={(value) => setChartType(value as "bar" | "line" | "composed")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type de graphique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Graphique à barres</SelectItem>
                    <SelectItem value="line">Graphique linéaire</SelectItem>
                    <SelectItem value="composed">Graphique composé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSimulated ? (
              <>
                {/* Graphique des résultats */}
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={simulationResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="clientName" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="riskBefore" name="Risque Avant" fill="#10b981" />
                        <Bar dataKey="riskAfter" name="Risque Après" fill="#f59e0b" />
                      </BarChart>
                    ) : chartType === "line" ? (
                      <LineChart data={simulationResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="clientName" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="riskBefore" name="Risque Avant" stroke="#10b981" />
                        <Line type="monotone" dataKey="riskAfter" name="Risque Après" stroke="#f59e0b" />
                      </LineChart>
                    ) : (
                      <ComposedChart data={simulationResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="clientName" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="riskBefore" name="Risque Avant" fill="#10b981" />
                        <Line type="monotone" dataKey="riskAfter" name="Risque Après" stroke="#f59e0b" />
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Graphique d'impact */}
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="clientName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="impact"
                        name="Impact (%)"
                        fill="#10b981"
                        stroke="#10b981"
                        strokeWidth={1}
                        radius={[4, 4, 0, 0]}
                      >
                        {impactData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.status === "improved"
                                ? "#10b981"
                                : entry.status === "worsened"
                                  ? "#ef4444"
                                  : "#f59e0b"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Tableau des résultats */}
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Client</th>
                        <th className="px-4 py-3 text-left font-medium">Risque Avant</th>
                        <th className="px-4 py-3 text-left font-medium">Risque Après</th>
                        <th className="px-4 py-3 text-left font-medium">Impact (%)</th>
                        <th className="px-4 py-3 text-left font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResults.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3">{result.clientName}</td>
                          <td className="px-4 py-3">{result.riskBefore.toFixed(2)}</td>
                          <td className="px-4 py-3">{result.riskAfter.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={result.impact > 0 ? "text-red-600" : result.impact < 0 ? "text-green-600" : ""}
                            >
                              {result.impact > 0 ? "+" : ""}
                              {result.impact.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                result.status === "improved"
                                  ? "border-green-200 bg-green-100 text-green-800"
                                  : result.status === "worsened"
                                    ? "border-red-200 bg-red-100 text-red-800"
                                    : "border-yellow-200 bg-yellow-100 text-yellow-800"
                              }
                            >
                              {result.status === "improved"
                                ? "Amélioré"
                                : result.status === "worsened"
                                  ? "Dégradé"
                                  : "Inchangé"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Alerte si risque élevé */}
                {simulationResults.some((result) => result.riskAfter > 0.5) && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start">
                      <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Alerte de Risque Élevé</h4>
                        <p className="text-sm text-red-700">
                          Cette simulation montre un niveau de risque élevé pour certains clients. Nous recommandons de
                          revoir la stratégie de prêt et d&apos;envisager des mesures d&apos;atténuation des risques.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enregistrer le scénario */}
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="text-lg font-medium">Enregistrer ce scénario</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="scenario-name">Nom du scénario</Label>
                      <Input
                        id="scenario-name"
                        placeholder="Ex: Hausse des taux d'intérêt"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scenario-description">Description (optionnelle)</Label>
                      <Input
                        id="scenario-description"
                        placeholder="Description du scénario"
                        value={scenarioDescription}
                        onChange={(e) => setScenarioDescription(e.target.value)}
                      />
                    </div>
                    <Button onClick={saveScenario} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer le scénario
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-[600px] items-center justify-center rounded-md border-2 border-dashed p-8 text-center">
                <div className="space-y-2">
                  <LineChartIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium">Aucune simulation effectuée</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajustez les paramètres et cliquez sur &quot;Exécuter la simulation&quot; pour voir les résultats.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scénarios sauvegardés et comparaison */}
      <Card>
        <CardHeader>
          <CardTitle>Scénarios sauvegardés</CardTitle>
          <CardDescription>
            Consultez et comparez vos scénarios sauvegardés. Sélectionnez jusqu&apos;à 3 scénarios pour les comparer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="w-10 px-4 py-3 text-left font-medium">
                    <span className="sr-only">Sélectionner</span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Nom</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => (
                  <tr key={scenario.id} className="border-b">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedScenarios.includes(scenario.id)}
                        onCheckedChange={() => toggleScenarioSelection(scenario.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{scenario.name}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{scenario.description}</td>
                    <td className="px-4 py-3">{scenario.timestamp}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => loadScenario(scenario.id)}>
                        Charger
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparaison des scénarios */}
          {selectedScenarios.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Comparaison des scénarios</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="clientName" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="riskBefore" name="Risque Initial" fill="#10b981" />
                    {selectedScenarios.map((scenarioId, index) => {
                      const scenario = scenarios.find((s) => s.id === scenarioId)
                      if (!scenario) return null
                      const colors = ["#f59e0b", "#3b82f6", "#ef4444"]
                      return (
                        <Bar
                          key={scenario.id}
                          dataKey={scenario.name}
                          name={scenario.name}
                          fill={colors[index % colors.length]}
                        />
                      )
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Analyse comparative</h4>
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">
                    Cette comparaison montre l&apos;impact des différents scénarios sur les profils de risque des
                    clients. Les scénarios avec des barres plus hautes représentent un risque plus élevé.
                  </p>
                  <div className="mt-4 space-y-2">
                    {selectedScenarios.map((scenarioId) => {
                      const scenario = scenarios.find((s) => s.id === scenarioId)
                      if (!scenario) return null

                      // Calculer l'impact moyen
                      const avgImpact =
                        scenario.results.reduce((sum, result) => sum + result.impact, 0) / scenario.results.length

                      return (
                        <div key={scenario.id} className="flex items-center justify-between rounded-md border p-2">
                          <span className="font-medium">{scenario.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              avgImpact > 10
                                ? "border-red-200 bg-red-100 text-red-800"
                                : avgImpact > 0
                                  ? "border-yellow-200 bg-yellow-100 text-yellow-800"
                                  : "border-green-200 bg-green-100 text-green-800"
                            }
                          >
                            Impact moyen: {avgImpact > 0 ? "+" : ""}
                            {avgImpact.toFixed(1)}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setSelectedScenarios([])}>
            Effacer la sélection
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={selectedScenarios.length === 0}>
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Enregistrer cette comparaison
          </Button>
        </CardFooter>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
          <CardDescription>
            Recommandations basées sur les résultats de la simulation et l&apos;analyse des risques.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="high-risk">Risque élevé</TabsTrigger>
              <TabsTrigger value="medium-risk">Risque modéré</TabsTrigger>
              <TabsTrigger value="low-risk">Risque faible</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 pt-4">
              <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4">
                <h3 className="font-medium text-yellow-800">Diversification des portefeuilles</h3>
                <p className="text-sm text-yellow-700">
                  Envisagez de diversifier davantage les portefeuilles de prêts pour réduire l&apos;exposition aux
                  risques sectoriels.
                </p>
              </div>
              <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
                <h3 className="font-medium text-red-800">Révision des taux d&apos;intérêt</h3>
                <p className="text-sm text-red-700">
                  Une révision des taux d&apos;intérêt est recommandée pour les clients à risque élevé afin de mieux
                  refléter leur profil de risque.
                </p>
              </div>
              <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-medium text-green-800">Augmentation des réserves</h3>
                <p className="text-sm text-green-700">
                  Augmentez les réserves de capital pour anticiper les fluctuations potentielles du marché et renforcer
                  la résilience financière.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="high-risk" className="space-y-4 pt-4">
              <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
                <h3 className="font-medium text-red-800">Révision des taux d&apos;intérêt</h3>
                <p className="text-sm text-red-700">
                  Une révision des taux d&apos;intérêt est recommandée pour les clients à risque élevé afin de mieux
                  refléter leur profil de risque.
                </p>
              </div>
              <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
                <h3 className="font-medium text-red-800">Limitation des nouveaux prêts</h3>
                <p className="text-sm text-red-700">
                  Envisagez de limiter temporairement les nouveaux prêts aux clients à risque élevé jusqu&apos;à ce que
                  leur profil de risque s&apos;améliore.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="medium-risk" className="space-y-4 pt-4">
              <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4">
                <h3 className="font-medium text-yellow-800">Diversification des portefeuilles</h3>
                <p className="text-sm text-yellow-700">
                  Envisagez de diversifier davantage les portefeuilles de prêts pour réduire l&apos;exposition aux
                  risques sectoriels.
                </p>
              </div>
              <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4">
                <h3 className="font-medium text-yellow-800">Surveillance accrue</h3>
                <p className="text-sm text-yellow-700">
                  Mettez en place une surveillance plus fréquente des indicateurs de risque pour ces clients afin de
                  détecter rapidement toute détérioration.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="low-risk" className="space-y-4 pt-4">
              <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-medium text-green-800">Augmentation des réserves</h3>
                <p className="text-sm text-green-700">
                  Augmentez les réserves de capital pour anticiper les fluctuations potentielles du marché et renforcer
                  la résilience financière.
                </p>
              </div>
              <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-medium text-green-800">Opportunités de croissance</h3>
                <p className="text-sm text-green-700">
                  Ces clients présentent des opportunités de croissance. Envisagez d&apos;élargir les offres de produits
                  et services pour ces clients à faible risque.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
