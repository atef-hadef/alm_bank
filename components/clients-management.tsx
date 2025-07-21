"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientsDataTable } from "@/components/clients-data-table"
import { AddClientDialog } from "@/components/add-client-dialog"
import { EditClientDialog } from "@/components/edit-client-dialog"
import { ViewClientDialog } from "@/components/view-client-dialog"
import { DeleteClientDialog } from "@/components/delete-client-dialog"
import { useToast } from "@/hooks/use-toast"

// Type pour un client
export type Client = {
  id: number
  name: string
  type: string
  loanAmount: number
  depositAmount: number
  calculatedRisk: number
  lastUpdated: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  notes?: string
}

// Données mockées pour les clients
const mockClients: Client[] = [
  {
    id: 1,
    name: "Banque Nationale",
    type: "Banque",
    loanAmount: 5000000,
    depositAmount: 7500000,
    calculatedRisk: 0.35,
    lastUpdated: "2023-04-15",
    email: "contact@banquenationale.fr",
    phone: "+33 1 23 45 67 89",
    address: "12 Avenue des Champs-Élysées, 75008 Paris",
    contactPerson: "Jean Dupont",
    notes: "Client important avec une bonne stabilité financière.",
  },
  {
    id: 2,
    name: "Crédit Mutuel",
    type: "Banque",
    loanAmount: 3500000,
    depositAmount: 4200000,
    calculatedRisk: 0.42,
    lastUpdated: "2023-04-12",
    email: "info@creditmutuel.fr",
    phone: "+33 1 34 56 78 90",
    address: "45 Rue de Rivoli, 75004 Paris",
    contactPerson: "Marie Laurent",
    notes: "Augmentation récente des prêts à surveiller.",
  },
  {
    id: 3,
    name: "BNP Paribas",
    type: "Banque",
    loanAmount: 8200000,
    depositAmount: 9100000,
    calculatedRisk: 0.28,
    lastUpdated: "2023-04-10",
    email: "contact@bnpparibas.fr",
    phone: "+33 1 45 67 89 01",
    address: "16 Boulevard des Italiens, 75009 Paris",
    contactPerson: "Philippe Martin",
    notes: "Excellent historique de remboursement.",
  },
  {
    id: 4,
    name: "Société Générale",
    type: "Banque",
    loanAmount: 6100000,
    depositAmount: 5800000,
    calculatedRisk: 0.51,
    lastUpdated: "2023-04-08",
    email: "info@societegenerale.fr",
    phone: "+33 1 56 78 90 12",
    address: "29 Boulevard Haussmann, 75009 Paris",
    contactPerson: "Sophie Dubois",
    notes: "Risque élevé à surveiller de près.",
  },
  {
    id: 5,
    name: "HSBC France",
    type: "Banque",
    loanAmount: 4300000,
    depositAmount: 6200000,
    calculatedRisk: 0.33,
    lastUpdated: "2023-04-05",
    email: "contact@hsbc.fr",
    phone: "+33 1 67 89 01 23",
    address: "103 Avenue des Champs-Élysées, 75008 Paris",
    contactPerson: "Thomas Bernard",
    notes: "Bonne relation client, potentiel d'expansion.",
  },
  {
    id: 6,
    name: "Crédit Agricole",
    type: "Banque",
    loanAmount: 7200000,
    depositAmount: 8500000,
    calculatedRisk: 0.31,
    lastUpdated: "2023-04-03",
    email: "info@credit-agricole.fr",
    phone: "+33 1 78 90 12 34",
    address: "91 Boulevard Pasteur, 75015 Paris",
    contactPerson: "Claire Moreau",
    notes: "Partenariat stratégique en cours de négociation.",
  },
  {
    id: 7,
    name: "Assurance Vie AXA",
    type: "Assurance",
    loanAmount: 2500000,
    depositAmount: 3800000,
    calculatedRisk: 0.29,
    lastUpdated: "2023-04-01",
    email: "contact@axa.fr",
    phone: "+33 1 89 01 23 45",
    address: "25 Avenue Matignon, 75008 Paris",
    contactPerson: "Luc Petit",
    notes: "Nouveau client avec potentiel de croissance.",
  },
  {
    id: 8,
    name: "Allianz France",
    type: "Assurance",
    loanAmount: 1800000,
    depositAmount: 2500000,
    calculatedRisk: 0.38,
    lastUpdated: "2023-03-28",
    email: "info@allianz.fr",
    phone: "+33 1 90 12 34 56",
    address: "1 Cours Michelet, 92800 Puteaux",
    contactPerson: "Émilie Roux",
    notes: "Besoin d'une révision de la stratégie de prêt.",
  },
  {
    id: 9,
    name: "Groupe BPCE",
    type: "Banque",
    loanAmount: 6500000,
    depositAmount: 7200000,
    calculatedRisk: 0.44,
    lastUpdated: "2023-03-25",
    email: "contact@bpce.fr",
    phone: "+33 1 01 23 45 67",
    address: "50 Avenue Pierre Mendès France, 75013 Paris",
    contactPerson: "Antoine Leroy",
    notes: "Risque modéré, surveillance recommandée.",
  },
  {
    id: 10,
    name: "CNP Assurances",
    type: "Assurance",
    loanAmount: 3200000,
    depositAmount: 4100000,
    calculatedRisk: 0.36,
    lastUpdated: "2023-03-22",
    email: "info@cnp.fr",
    phone: "+33 1 12 34 56 78",
    address: "4 Place Raoul Dautry, 75015 Paris",
    contactPerson: "Isabelle Blanc",
    notes: "Bonne performance globale.",
  },
]

export function ClientsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Fonction pour ajouter un nouveau client
  const handleAddClient = (client: Omit<Client, "id" | "lastUpdated">) => {
    const newClient: Client = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    setClients([...clients, newClient])
    setIsAddDialogOpen(false)
    toast({
      title: "Client ajouté",
      description: `${client.name} a été ajouté avec succès.`,
    })
  }

  // Fonction pour mettre à jour un client existant
  const handleUpdateClient = (updatedClient: Client) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id
          ? { ...updatedClient, lastUpdated: new Date().toISOString().split("T")[0] }
          : client,
      ),
    )
    setIsEditDialogOpen(false)
    toast({
      title: "Client mis à jour",
      description: `Les informations de ${updatedClient.name} ont été mises à jour.`,
    })
  }

  // Fonction pour supprimer un client
  const handleDeleteClient = (id: number) => {
    const clientToDelete = clients.find((client) => client.id === id)
    setClients(clients.filter((client) => client.id !== id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Client supprimé",
      description: `${clientToDelete?.name} a été supprimé avec succès.`,
      variant: "destructive",
    })
  }

  // Actions pour chaque client
  const clientActions = [
    {
      icon: <Eye className="mr-2 h-4 w-4" />,
      label: "Voir les détails",
      onClick: (client: Client) => {
        setSelectedClient(client)
        setIsViewDialogOpen(true)
      },
    },
    {
      icon: <Pencil className="mr-2 h-4 w-4" />,
      label: "Modifier",
      onClick: (client: Client) => {
        setSelectedClient(client)
        setIsEditDialogOpen(true)
      },
    },
    {
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      label: "Supprimer",
      onClick: (client: Client) => {
        setSelectedClient(client)
        setIsDeleteDialogOpen(true)
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liste des Clients</CardTitle>
            <CardDescription>Gérez et analysez les données de vos clients</CardDescription>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un client
          </Button>
        </CardHeader>
        <CardContent>
          <ClientsDataTable data={clients} actions={clientActions} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddClientDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={handleAddClient} />

      {selectedClient && (
        <>
          <EditClientDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            client={selectedClient}
            onSubmit={handleUpdateClient}
          />

          <ViewClientDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            client={selectedClient}
            onEdit={() => {
              setIsViewDialogOpen(false)
              setIsEditDialogOpen(true)
            }}
            onDelete={() => {
              setIsViewDialogOpen(false)
              setIsDeleteDialogOpen(true)
            }}
            onSimulate={() => {
              router.push("/risk-analysis?tab=simulation&client=" + selectedClient.id)
            }}
          />

          <DeleteClientDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            client={selectedClient}
            onConfirm={() => handleDeleteClient(selectedClient.id)}
          />
        </>
      )}
    </div>
  )
}
