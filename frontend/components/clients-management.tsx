"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientsDataTable } from "@/components/clients-data-table"
import  AddClientDialog  from "@/components/add-client-dialog"
import { EditClientDialog } from "@/components/edit-client-dialog"
import { ViewClientDialog } from "@/components/view-client-dialog"
import { DeleteClientDialog } from "@/components/delete-client-dialog"
import { useToast } from "@/hooks/use-toast"

// URL de l'API
const API_URL = "http://localhost:5000/api/clients"

// Type pour un client
export type Client = {
  id: number
  name: string
  type: string
  loanAmount: number
  depositAmount: number
  calculatedRisk: number
  riskLevel: string
  lastUpdated: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  notes?: string
}

export function ClientsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Charger les clients au chargement du composant
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(API_URL)
        setClients(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les clients. Veuillez réessayer."
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [toast])

  // Fonction pour ajouter un nouveau client
  const handleAddClient = (newClient) => {
    // Le client est déjà enregistré dans la base de données par le backend
    setClients([newClient, ...clients])
    toast({
      title: "Client ajouté",
      description: `${newClient.name} a été ajouté avec un niveau de risque ${newClient.riskLevel} (${(newClient.calculatedRisk * 100).toFixed(1)}%).`,
    })
  }

  // Fonction pour mettre à jour un client existant
  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      // Mettre à jour le client dans le backend
      await axios.put(`${API_URL}/${updatedClient.id}`, {
        ...updatedClient,
        lastUpdated: new Date().toISOString().split("T")[0]
      })
      
      // Mettre à jour l'état local
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
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le client. Veuillez réessayer."
      })
    }
  }

  // Fonction pour supprimer un client
  const handleDeleteClient = async (id: number) => {
    try {
      const clientToDelete = clients.find((client) => client.id === id)
      
      // Supprimer le client dans le backend
      await axios.delete(`${API_URL}/${id}`)
      
      // Mettre à jour l'état local
      setClients(clients.filter((client) => client.id !== id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Client supprimé",
        description: `${clientToDelete?.name} a été supprimé avec succès.`,
      })
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer."
      })
    }
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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Chargement des clients...</p>
            </div>
          ) : (
            <ClientsDataTable data={clients} actions={clientActions} />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddClientDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onClientAdded={handleAddClient} 
      />

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













