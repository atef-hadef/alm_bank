import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RiskDashboard  from "@/components/risk-dashboard"
import { ClientsTable } from "@/components/clients-table"
import { RiskSimulator } from "@/components/risk-simulator"
import { ClientFilter } from "@/components/client-filter"

export const metadata: Metadata = {
  title: "Analyse des Risques | ALM Solution",
  description: "Visualisez et analysez les risques financiers de vos clients avec notre solution ALM complète.",
}

export default function RiskAnalysisPage() {
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
            <span className="font-medium text-foreground">Analyse des Risques</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 border-b pb-8 pt-2 md:flex-row md:items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Analyse des Risques</h1>
              <p className="text-muted-foreground">
                Visualisez et analysez les risques financiers de vos clients en temps réel.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700">
                Nouveau Client
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 py-8 md:grid-cols-8">
            {/* Sidebar with filters */}
            <div className="md:col-span-2">
              <div className="sticky top-24 space-y-6">
                <ClientFilter />
              </div>
            </div>

            {/* Main dashboard */}
            <div className="md:col-span-6 space-y-6">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="space-y-6 pt-6">
                  <RiskDashboard />
                </TabsContent>
                <TabsContent value="simulation" className="space-y-6 pt-6">
                  <RiskSimulator />
                </TabsContent>
                <TabsContent value="clients" className="space-y-6 pt-6">
                  <ClientsTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Call to Action */}
          <div className="my-8 rounded-lg bg-emerald-50 p-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter text-emerald-900 sm:text-3xl">
                    Besoin d&apos;une analyse plus approfondie ?
                  </h2>
                  <p className="text-emerald-800 md:text-lg">
                    Notre équipe d&apos;experts peut vous aider à comprendre et à optimiser votre gestion des risques.
                    Contactez-nous pour une consultation personnalisée.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Contacter un expert</Button>
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    En savoir plus
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-lg font-semibold text-emerald-900">Avantages de notre analyse avancée</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
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
                        className="h-5 w-5 text-emerald-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Analyse détaillée des facteurs de risque</span>
                    </li>
                    <li className="flex items-start gap-2">
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
                        className="h-5 w-5 text-emerald-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Recommandations personnalisées</span>
                    </li>
                    <li className="flex items-start gap-2">
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
                        className="h-5 w-5 text-emerald-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Stratégies d&apos;atténuation des risques</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
