import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RiskSimulator } from "@/components/risk-simulator-advanced"

export const metadata: Metadata = {
  title: "Simulation des Risques | ALM Solution",
  description: "Simulez l'impact des changements économiques sur les profils de risque de vos clients.",
}

export default function RiskSimulationPage() {
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
            <span className="font-medium text-foreground">Simulation des Risques</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 border-b pb-8 pt-2 md:flex-row md:items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Simulation des Risques</h1>
              <p className="text-muted-foreground">
                Simulez l&apos;impact des changements économiques sur les profils de risque de vos clients.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter les résultats
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-8">
            <RiskSimulator />
          </div>
        </div>
      </main>
    </div>
  )
}
