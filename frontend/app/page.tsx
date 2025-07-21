import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BarChart3, LineChart, Users, Brain, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import StatCounter from "@/components/stat-counter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ALM Solution</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-emerald-600">
              Accueil
            </Link>
            <Link
              href="/risk-analysis"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600"
            >
              Analyse des risques
            </Link>
            <Link
              href="/client-management"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600"
            >
              Client Management
            </Link>
            <Link
              href="/risk-simulation"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600"
            >
              Simulation de risques
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600"
            >
              À propos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex">
              Se connecter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Essai gratuit</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
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
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Optimisez la gestion des risques financiers
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Évaluez, simulez et gérez les risques de vos clients en toute simplicité avec notre solution ALM
                    complète.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Commencer
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Voir l&apos;analyse des risques</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Illustration de gestion des risques bancaires"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-100/80">
                  Fonctionnalités principales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Une solution complète pour la gestion des risques
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Notre plateforme ALM offre des outils puissants pour analyser, simuler et gérer les risques
                  financiers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-emerald-600" />
                      <CardTitle>Analyse des risques en temps réel</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Obtenez des évaluations de risques précises et en temps réel grâce à nos algorithmes avancés et
                      nos tableaux de bord interactifs.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                      <CardTitle>Simulation de scénarios</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Testez différents scénarios économiques et évaluez l&apos;impact sur vos portefeuilles pour
                      anticiper les risques potentiels.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-600" />
                      <CardTitle>Gestion des clients</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Suivez les profils des clients, y compris leurs risques financiers et historiques, dans une
                      interface intuitive et sécurisée.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-emerald-600" />
                      <CardTitle>Recommandations basées sur l&apos;IA</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Recevez des recommandations intelligentes pour améliorer vos stratégies de gestion des risques
                      grâce à notre moteur d&apos;IA avancé.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-100/80">
                  Témoignages
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ce que nos clients disent
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez comment notre solution ALM aide les institutions financières à optimiser leur gestion des
                  risques.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <TestimonialCarousel />
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-100/80">
                  Statistiques
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Notre impact en chiffres
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Des résultats concrets qui démontrent l&apos;efficacité de notre solution ALM.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-10">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-4xl font-bold text-emerald-600">
                  <StatCounter end={500} suffix="+" duration={2} />
                </div>
                <p className="text-xl font-medium">Clients analysés</p>
                <p className="text-sm text-muted-foreground">Institutions financières qui utilisent notre plateforme</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-4xl font-bold text-emerald-600">
                  <StatCounter end={10} suffix="M €" duration={2} />
                </div>
                <p className="text-xl font-medium">Risques gérés</p>
                <p className="text-sm text-muted-foreground">
                  Montant total des risques financiers gérés par notre solution
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-4xl font-bold text-emerald-600">
                  <StatCounter end={1000} suffix="+" duration={2} />
                </div>
                <p className="text-xl font-medium">Simulations quotidiennes</p>
                <p className="text-sm text-muted-foreground">Nombre de simulations de risques effectuées chaque jour</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Commencez à gérer vos risques dès aujourd&apos;hui
                  </h2>
                  <p className="max-w-[600px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Essayez notre solution ALM gratuitement pendant 30 jours et découvrez comment elle peut transformer
                    votre approche de la gestion des risques.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-emerald-900 hover:bg-emerald-100">
                    S&apos;inscrire maintenant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-emerald-800">
                    Contactez-nous
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="rounded-lg bg-emerald-800 p-8 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold">Pourquoi choisir notre solution ALM ?</h3>
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
                        className="h-5 w-5 text-emerald-300"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Interface intuitive et facile à utiliser</span>
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
                        className="h-5 w-5 text-emerald-300"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Analyses précises et en temps réel</span>
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
                        className="h-5 w-5 text-emerald-300"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Support client dédié et réactif</span>
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
                        className="h-5 w-5 text-emerald-300"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Mises à jour régulières et nouvelles fonctionnalités</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-slate-900 text-slate-200 py-10">
        <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold">ALM Solution</span>
            </div>
            <p className="text-sm text-slate-400">
              Solution complète de gestion des risques pour les institutions financières.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-slate-400 hover:text-white">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white">
                  Tarification
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-slate-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-400 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-slate-400 hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 border-t border-slate-800 pt-6 px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} ALM Solution. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-white">
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
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
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
