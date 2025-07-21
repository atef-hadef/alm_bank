import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { getRiskBadgeClasses, getRiskLevel } from "@/lib/utils";

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
}

export function ViewClientDialog({ open, onOpenChange, client }: ViewClientDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{client.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="risk">Analyse de risque</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="ml-auto font-medium">{client.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Dernière mise à jour:</span>
                      <span className="ml-auto font-medium">{client.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Finances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">Montant du prêt:</span>
                      <span className="ml-auto font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(client.loanAmount)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">Montant du dépôt:</span>
                      <span className="ml-auto font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(client.depositAmount)}
                      </span>
                    </div>
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
                  <div className="text-4xl font-bold">{(client.calculatedRisk * 100).toFixed(0)}%</div>
                  <div className={getRiskBadgeClasses(client.calculatedRisk)}>
                    {getRiskLevel(client.calculatedRisk)}
                  </div>
                </div>
                
                {client.calculatedRisk > 0.7 && (
                  <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start">
                      <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm text-red-700">
                          Ce client présente un niveau de risque élevé. Une attention particulière est recommandée.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Coordonnées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="ml-auto font-medium">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Téléphone:</span>
                      <span className="ml-auto font-medium">{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Adresse:</span>
                      <span className="ml-auto font-medium">{client.address}</span>
                    </div>
                  )}
                  {client.contactPerson && (
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Personne à contacter:</span>
                      <span className="ml-auto font-medium">{client.contactPerson}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {client.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{client.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse détaillée du risque</CardTitle>
                <CardDescription>
                  Évaluation basée sur notre modèle d'intelligence artificielle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score de risque:</span>
                    <div className="flex items-center">
                      <div className="mr-2 text-2xl font-bold">{(client.calculatedRisk * 100).toFixed(1)}%</div>
                      <div className={getRiskBadgeClasses(client.calculatedRisk)}>
                        {getRiskLevel(client.calculatedRisk)}
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        client.calculatedRisk > 0.7
                          ? "bg-red-500"
                          : client.calculatedRisk > 0.4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${client.calculatedRisk * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-medium">Facteurs de risque</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-md border p-3">
                        <div className="text-sm text-muted-foreground">Ratio prêt/dépôt</div>
                        <div className="mt-1 text-lg font-medium">
                          {client.depositAmount === 0
                            ? "∞"
                            : (client.loanAmount / client.depositAmount).toFixed(2)}
                        </div>
                      </div>
                      
                      {client.age && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm text-muted-foreground">Âge</div>
                          <div className="mt-1 text-lg font-medium">{client.age} ans</div>
                        </div>
                      )}
                      
                      {client.score_credit && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm text-muted-foreground">Score de crédit</div>
                          <div className="mt-1 text-lg font-medium">{client.score_credit}</div>
                        </div>
                      )}
                      
                      {client.delai_paiement_moyen && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm text-muted-foreground">Délai de paiement moyen</div>
                          <div className="mt-1 text-lg font-medium">{client.delai_paiement_moyen} jours</div>
                        </div>
                      )}
                      
                      {client.nb_incidents_paiement !== undefined && (
                        <div className="rounded-md border p-3">
                          <div className="text-sm text-muted-foreground">Incidents de paiement</div>
                          <div className="mt-1 text-lg font-medium">{client.nb_incidents_paiement}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {client.calculatedRisk > 0.4 && (
                    <div className={`mt-4 rounded-md p-4 ${
                      client.calculatedRisk > 0.7 ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"
                    }`}>
                      <h4 className={`text-sm font-medium ${
                        client.calculatedRisk > 0.7 ? "text-red-800" : "text-yellow-800"
                      }`}>
                        Recommandations
                      </h4>
                      <ul className={`mt-2 list-disc pl-5 text-sm ${
                        client.calculatedRisk > 0.7 ? "text-red-700" : "text-yellow-700"
                      }`}>
                        {client.calculatedRisk > 0.7 ? (
                          <>
                            <li>Limiter l'exposition au risque en réduisant le montant du prêt</li>
                            <li>Exiger des garanties supplémentaires</li>
                            <li>Augmenter le taux d'intérêt pour compenser le risque</li>
                            <li>Mettre en place un suivi renforcé des paiements</li>
                          </>
                        ) : (
                          <>
                            <li>Envisager une révision des conditions de prêt</li>
                            <li>Demander des garanties complémentaires</li>
                            <li>Établir un plan de suivi régulier</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


