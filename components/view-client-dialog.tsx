"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileEdit, LineChartIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Client } from "./clients-management"

// Données mockées pour l'historique des risques
const riskHistory = [
  { date: "2023-01", risk: 0.28 },
  { date: "2023-02", risk: 0.31 },
  { date: "2023-03", risk: 0.33 },
  { date: "2023-04", risk: 0.35 },
  { date: "2023-05", risk: 0.32 },
  { date: "2023-06", risk: 0.34 },
]

interface ViewClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  onEdit: () => void
  onDelete: () => void
  onSimulate: () => void
}

export function ViewClientDialog({ open, onOpenChange, client, onEdit, onDelete, onSimulate }: ViewClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
          <DialogDescription>Détails du client et profil de risque</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="risk">Profil de risque</TabsTrigger>
            <TabsTrigger value="contact">Coordonnées</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Type de client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{client.type}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Dernière mise à jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date(client.lastUpdated).toLocaleDateString("fr-FR")}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Montant du prêt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(client.loanAmount)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Montant des dépôts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(client.depositAmount)}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Risque calculé</CardTitle>
                <CardDescription>Niveau de risque actuel du client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{client.calculatedRisk.toFixed(2)}</div>
                  <div
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      client.calculatedRisk > 0.5
                        ? "bg-red-100 text-red-800"
                        : client.calculatedRisk > 0.3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {client.calculatedRisk > 0.5 ? "Élevé" : client.calculatedRisk > 0.3 ? "Modéré" : "Faible"}
                  </div>
                </div>
              </CardContent>
            </Card>
            {client.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{client.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="risk" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique du risque</CardTitle>
                <CardDescription>Évolution du risque sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={riskHistory}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Analyse du risque</CardTitle>
                <CardDescription>Facteurs contribuant au niveau de risque actuel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Ratio prêt/dépôt</span>
                    <span className="font-medium">{(client.loanAmount / client.depositAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exposition au risque de marché</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.calculatedRisk > 0.4 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {client.calculatedRisk > 0.4 ? "Modérée" : "Faible"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stabilité financière</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.depositAmount > client.loanAmount
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {client.depositAmount > client.loanAmount ? "Bonne" : "À surveiller"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Téléphone:</span>
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Adresse:</span>
                      <span>{client.address}</span>
                    </div>
                  )}
                  {client.contactPerson && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Personne de contact:</span>
                      <span>{client.contactPerson}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <FileEdit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onSimulate} className="bg-emerald-600 hover:bg-emerald-700">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Simuler le risque
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
