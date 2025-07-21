import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// URL du backend
const API_URL = "http://localhost:8000/api/clients";

const AddClientDialog = ({ open, onOpenChange, onClientAdded }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clientResult, setClientResult] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: 35,
    estimatedIncome: 0,
    creditCardBalance: 0,
    bankLoans: 0,
    superannuationSavings: 0,
    savingAccounts: 0,
    propertiesOwned: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" ||
        name === "estimatedIncome" ||
        name === "creditCardBalance" ||
        name === "bankLoans" ||
        name === "superannuationSavings" ||
        name === "savingAccounts" ||
        name === "propertiesOwned"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleAddClient = async () => {
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name) {
        throw new Error("Le nom du client est requis");
      }
      if (formData.age < 18) {
        throw new Error("L'âge doit être supérieur ou égal à 18 ans");
      }
      if (formData.estimatedIncome < 0) {
        throw new Error("Le revenu estimé ne peut pas être négatif");
      }
      if (formData.creditCardBalance < 0) {
        throw new Error("Le solde de la carte de crédit ne peut pas être négatif");
      }
      if (formData.bankLoans < 0) {
        throw new Error("Le montant du prêt ne peut pas être négatif");
      }
      if (formData.superannuationSavings < 0) {
        throw new Error("L'épargne de retraite ne peut pas être négative");
      }
      if (formData.savingAccounts < 0) {
        throw new Error("Le compte d'épargne ne peut pas être négatif");
      }
      if (formData.propertiesOwned < 0) {
        throw new Error("Le nombre de propriétés ne peut pas être négatif");
      }

      console.log("Envoi des données au backend:", formData);

      // Envoi des données au backend
      const response = await axios.post(API_URL, {
        ...formData,
        lastUpdated: new Date().toISOString().split("T")[0],
      });

      console.log("Réponse du backend:", response.data);

      // Récupération du client avec le risque calculé
      const newClient = response.data;

      // Afficher le résultat
      setClientResult(newClient);

      // Informer le parent
      if (typeof onClientAdded === "function") {
        onClientAdded(newClient);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le client. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientResult(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: 35,
      estimatedIncome: 0,
      creditCardBalance: 0,
      bankLoans: 0,
      superannuationSavings: 0,
      savingAccounts: 0,
      propertiesOwned: 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {clientResult ? "Résultat de l'analyse de risque" : "Ajouter un nouveau client"}
          </DialogTitle>
        </DialogHeader>

        {clientResult ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risque de défaut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">
                    {clientResult.defaultRisk === 1 ? "Défaut" : "Non défaut"}
                  </div>
                  <div
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      clientResult.defaultRisk === 1
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {clientResult.defaultRisk === 1 ? "Risque élevé" : "Risque faible"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Informations du client</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Nom:</div>
                <div className="text-right">{clientResult.name}</div>
                <div>Email:</div>
                <div className="text-right">{clientResult.email || "Non fourni"}</div>
                <div>Téléphone:</div>
                <div className="text-right">{clientResult.phone || "Non fourni"}</div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Ratios financiers</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Ratio Dette/Revenu:</div>
                <div className="text-right">{clientResult.debt_to_income_ratio?.toFixed(2) || "N/A"}</div>
                <div>Ratio Épargne/Dette:</div>
                <div className="text-right">{clientResult.savings_to_debt_ratio?.toFixed(2) || "N/A"}</div>
              </div>
            </div>

            {clientResult.defaultRisk === 1 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Alerte de Risque Élevé</h4>
                    <p className="text-sm text-red-700">
                      Ce client présente un risque de défaut élevé. Nous recommandons de revoir les conditions de prêt
                      et d'envisager des garanties supplémentaires.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button onClick={handleClose}>Fermer</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge *</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedIncome">Revenu estimé (€) *</Label>
                <Input
                  id="estimatedIncome"
                  name="estimatedIncome"
                  type="number"
                  value={formData.estimatedIncome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditCardBalance">Solde carte de crédit (€)</Label>
                <Input
                  id="creditCardBalance"
                  name="creditCardBalance"
                  type="number"
                  value={formData.creditCardBalance}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankLoans">Montant du prêt (€)</Label>
                <Input
                  id="bankLoans"
                  name="bankLoans"
                  type="number"
                  value={formData.bankLoans}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="superannuationSavings">Épargne de retraite (€)</Label>
                <Input
                  id="superannuationSavings"
                  name="superannuationSavings"
                  type="number"
                  value={formData.superannuationSavings}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="savingAccounts">Compte d'épargne (€)</Label>
                <Input
                  id="savingAccounts"
                  name="savingAccounts"
                  type="number"
                  value={formData.savingAccounts}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertiesOwned">Nombre de propriétés</Label>
                <Input
                  id="propertiesOwned"
                  name="propertiesOwned"
                  type="number"
                  value={formData.propertiesOwned}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddClient} disabled={isLoading}>
                {isLoading ? "Traitement..." : "Ajouter le client"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;