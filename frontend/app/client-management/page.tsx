import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Download, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ClientsManagement } from "@/components/clients-management"

export const metadata: Metadata = {
  title: "Gestion des Clients | ALM Solution",
  description: "Gérez les informations de vos clients et visualisez leurs profils de risque.",
}

export default function ClientManagementPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container relative">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Accueil
            </Link>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="font-medium text-foreground">Gestion des Clients</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 border-b pb-8 pt-2 md:flex-row md:items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
              <p className="text-muted-foreground">
                Ajoutez, modifiez et gérez les informations de vos clients bancaires.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Client
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-8">
            <ClientsManagement />
          </div>
        </div>
      </main>
    </div>
  )
}
