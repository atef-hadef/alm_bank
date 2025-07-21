"use client"

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewClientDialog } from "@/components/view-client-dialog";
import { EditClientDialog } from "@/components/edit-client-dialog";
import { DeleteClientDialog } from "@/components/delete-client-dialog";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { getRiskTableBadgeClasses, getRiskLevel } from "@/lib/utils";

interface ClientsTableProps {
  clients: any[];
  onClientUpdated?: (updatedClient: any) => void;
  onClientDeleted?: (clientId: number) => void;
}

export function ClientsTable({ clients, onClientUpdated, onClientDeleted }: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.riskLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditDialogOpen(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const handleClientUpdated = (updatedClient) => {
    if (typeof onClientUpdated === 'function') {
      onClientUpdated(updatedClient);
    }
  };

  const handleClientDeleted = (clientId) => {
    if (typeof onClientDeleted === 'function') {
      onClientDeleted(clientId);
    }
  };

  // Formater les montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Prêt</TableHead>
              <TableHead className="hidden md:table-cell">Dépôt</TableHead>
              <TableHead>Risque</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(client.loanAmount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(client.depositAmount)}
                  </TableCell>
                  <TableCell>
                    <span className={getRiskTableBadgeClasses(client.calculatedRisk)}>
                      {getRiskLevel(client.calculatedRisk)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClient(client)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedClient && (
        <>
          <ViewClientDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            client={selectedClient}
          />
          <EditClientDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            client={selectedClient}
            onClientUpdated={handleClientUpdated}
          />
          <DeleteClientDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            client={selectedClient}
            onClientDeleted={handleClientDeleted}
          />
        </>
      )}
    </div>
  );
}




