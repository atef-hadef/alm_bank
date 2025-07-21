"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, ArrowRight, LineChartIcon } from "lucide-react"

// Données mockées pour les clients
const mockClients = [
  { id: 1, name: "Banque Nationale", loanAmount: 5000000, depositAmount: 7500000, calculatedRisk: 0.35 },
  { id: 2, name: "Crédit Mutuel", loanAmount: 3500000, depositAmount: 4200000, calculatedRisk: 0.42 },
  { id: 3, name: "BNP Paribas", loanAmount: 8200000, depositAmount: 9100000, calculatedRisk: 0.28 },
  { id: 4, name: "Société Générale", loanAmount: 6100000, depositAmount: 5800000, calculatedRisk: 0.51 },
  { id: 5, name: "HSBC France", loanAmount: 4300000, depositAmount: 6200000, calculatedRisk: 0.33 },
  { id: 6, name: "Crédit Agricole", loanAmount: 7200000, depositAmount: 8500000, calculatedRisk: 0.31 },
]

// Fonction pour générer des données de simulation
const generateSimulationData = (baseRisk: number, rateChange: number, loanChange: number, depositChange: number) => {
  // Simuler l'impact des changements sur le risque
  const rateImpact = rateChange * 0.05 // 1% de changement de taux = 0.05 d'impact sur le risque
  const loanImpact = (loanChange / 100) * 0.02 // 1% de changement de prêt = 0.02 d'impact sur le risque
  const depositImpact = (depositChange / 100) * -0.015 // 1% de changement de dépôt = -0.015 d'impact sur le risque

  const newRisk = baseRisk + rateImpact + loanImpact + depositImpact

  // Générer des données pour le graphique de simulation
  return [
    { name: "Actuel", risk: baseRisk },
    { name: "Taux d'intérêt", risk: baseRisk + rateImpact },
    { name: "Prêts", risk: baseRisk + rateImpact + loanImpact },
    { name: "Dépôts", risk: newRisk },
  ]
}

export function RiskSimulator() {
  const [selectedClient, setSelectedClient] = useState<string>("1")
  const [rateChange, setRateChange] = useState<number>(0)
  const [loanChange, setLoanChange] = useState<number>(0)
  const [depositChange, setDepositChange] = useState<number>(0)
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [simulationData, setSimulationData] = useState<any[]>([])

  const client = mockClients.find((c) => c.id.toString() === selectedClient)

  const handleSimulation = () => {
    if (!client) return

    // Calculer le nouveau risque
    const rateImpact = rateChange * 0.05
    const loanImpact = (loanChange / 100) * 0.02
    const depositImpact = (depositChange / 100) * -0.015

    const newRisk = client.calculatedRisk + rateImpact + loanImpact + depositImpact

    // Générer les données pour le graphique
    const data = generateSimulationData(client.calculatedRisk, rateChange, loanChange, depositChange)

    setSimulationData(data)
    setSimulationResult({
      originalRisk: client.calculatedRisk,
      newRisk: newRisk,
      change: newRisk - client.calculatedRisk,
      riskLevel: newRisk > 0.5 ? "Élevé" : newRisk > 0.3 ? "Modéré" : "Faible",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulateur de Risques</CardTitle>
          <CardDescription>
            Simulez l&apos;impact des changements économiques sur le risque de vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Sélectionner un client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {client && (
                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Informations actuelles</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Montant du Prêt:</div>
                    <div className="text-right">{client.loanAmount.toLocaleString()} €</div>
                    <div>Montant des Dépôts:</div>
                    <div className="text-right">{client.depositAmount.toLocaleString()} €</div>
                    <div>Risque Actuel:</div>
                    <div className="text-right">{client.calculatedRisk.toFixed(2)}</div>
                    <div>Niveau de Risque:</div>
                    <div className="text-right">
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
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rate-change">Variation des taux d&apos;intérêt (%)</Label>
                    <span className="text-sm text-muted-foreground">{rateChange}%</span>
                  </div>
                  <Slider
                    id="rate-change"
                    min={-5}
                    max={5}
                    step={0.1}
                    value={[rateChange]}
                    onValueChange={(value) => setRateChange(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loan-change">Variation des prêts (%)</Label>
                    <span className="text-sm text-muted-foreground">{loanChange}%</span>
                  </div>
                  <Slider
                    id="loan-change"
                    min={-20}
                    max={20}
                    step={1}
                    value={[loanChange]}
                    onValueChange={(value) => setLoanChange(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="deposit-change">Variation des dépôts (%)</Label>
                    <span className="text-sm text-muted-foreground">{depositChange}%</span>
                  </div>
                  <Slider
                    id="deposit-change"
                    min={-20}
                    max={20}
                    step={1}
                    value={[depositChange]}
                    onValueChange={(value) => setDepositChange(value[0])}
                  />
                </div>

                <Button onClick={handleSimulation} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Simuler le Risque
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {simulationResult ? (
                <>
                  <div className="rounded-md bg-muted p-4">
                    <h3 className="mb-2 font-medium">Résultat de la Simulation</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Risque Original:</div>
                      <div className="text-right">{simulationResult.originalRisk.toFixed(2)}</div>
                      <div>Nouveau Risque:</div>
                      <div className="text-right">{simulationResult.newRisk.toFixed(2)}</div>
                      <div>Changement:</div>
                      <div className="text-right">
                        <span
                          className={`${
                            simulationResult.change > 0
                              ? "text-red-600"
                              : simulationResult.change < 0
                                ? "text-green-600"
                                : ""
                          }`}
                        >
                          {simulationResult.change > 0 ? "+" : ""}
                          {simulationResult.change.toFixed(2)}
                        </span>
                      </div>
                      <div>Nouveau Niveau:</div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            simulationResult.newRisk > 0.5
                              ? "bg-red-100 text-red-800"
                              : simulationResult.newRisk > 0.3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {simulationResult.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulationData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="risk"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                          name="Niveau de Risque"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {simulationResult.newRisk > simulationResult.originalRisk && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                      <div className="flex items-start">
                        <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800">Alerte de Risque</h4>
                          <p className="text-sm text-red-700">
                            Cette simulation montre une augmentation du risque. Nous recommandons de revoir la stratégie
                            de prêt pour ce client.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {simulationResult.newRisk < simulationResult.originalRisk && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-5 w-5 text-green-600"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Amélioration du Risque</h4>
                          <p className="text-sm text-green-700">
                            Cette simulation montre une réduction du risque. Les changements proposés pourraient
                            améliorer la stabilité financière du client.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed p-8 text-center">
                  <div className="space-y-2">
                    <LineChartIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
                    <h3 className="text-lg font-medium">Aucune simulation effectuée</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajustez les paramètres et cliquez sur &quot;Simuler le Risque&quot; pour voir les résultats.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
