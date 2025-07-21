import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// URL du backend
const API_URL = "http://localhost:5000/api/clients";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  onClientUpdated?: (updatedClient: any) => void;
}

export function EditClientDialog({ open, onOpenChange, client, onClientUpdated }: EditClientDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    loanAmount: 0,
    depositAmount: 0,
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    notes: "",
    // Champs pour le modèle de risque
    age: 35,
    score_credit: 650,
    delai_paiement_moyen: 15,
    nb_incidents_paiement: 0
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        type: client.type || "Particulier",
        loanAmount: client.loanAmount || 0,
        depositAmount: client.depositAmount || 0,
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        contactPerson: client.contactPerson || "",
        notes: client.notes || "",
        age: client.age || 35,
        score_credit: client.score_credit || 650,
        delai_paiement_moyen: client.delai_paiement_moyen || 15,
        nb_incidents_paiement: client.nb_incidents_paiement || 0
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "loanAmount" || name === "depositAmount" || 
               name === "age" || name === "score_credit" || 
               name === "delai_paiement_moyen" || name === "nb_incidents_paiement"
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation simple
      if (!formData.name) {
        throw new Error("Le nom du client est requis");
      }
      
      console.log("Envoi des données au backend:", formData);
      
      // Envoi des données au backend
      const response = await axios.put(`${API_URL}/${client.id}`, formData);
      
      console.log("Réponse du backend:", response.data);
      
      // Récupération du client mis à jour
      const updatedClient = response.data;
      
      toast({
        title: "Client mis à jour avec succès",
        description: `Niveau de risque: ${updatedClient.riskLevel} (${(updatedClient.calculatedRisk * 100).toFixed(1)}%)`
      });
      
      // Fermer la boîte de dialogue
      onOpenChange(false);
      
      // Informer le parent si la fonction existe
      if (typeof onClientUpdated === 'function') {
        onClientUpdated(updatedClient);
      }
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le client. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="risk">Facteurs de risque</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select 
                    id="type" 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Banque">Banque</option>
                    <option value="Assurance">Assurance</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Montant du prêt (€)</Label>
                  <Input 
                    id="loanAmount" 
                    name="loanAmount" 
                    type="number" 
                    value={formData.loanAmount} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Montant du dépôt (€)</Label>
                  <Input 
                    id="depositAmount" 
                    name="depositAmount" 
                    type="number" 
                    value={formData.depositAmount} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Personne à contacter</Label>
                <Input 
                  id="contactPerson" 
                  name="contactPerson" 
                  value={formData.contactPerson} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge (si particulier)</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    value={formData.age} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score_credit">Score de crédit (300-850)</Label>
                  <Input 
                    id="score_credit" 
                    name="score_credit" 
                    type="number" 
                    min="300"
                    max="850"
                    value={formData.score_credit} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delai_paiement_moyen">Délai de paiement moyen (jours)</Label>
                  <Input 
                    id="delai_paiement_moyen" 
                    name="delai_paiement_moyen" 
                    type="number" 
                    value={formData.delai_paiement_moyen} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nb_incidents_paiement">Nombre d'incidents de paiement</Label>
                  <Input 
                    id="nb_incidents_paiement" 
                    name="nb_incidents_paiement" 
                    type="number" 
                    min="0"
                    value={formData.nb_incidents_paiement} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4 mt-4">
                <p className="text-sm text-blue-700">
                  La modification de ces paramètres entraînera un recalcul du niveau de risque par notre modèle 
                  d'intelligence artificielle. Plus les informations sont complètes, plus l'évaluation sera précise.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}





