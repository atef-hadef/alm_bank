"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

export function ClientFilter() {
  const [clientType, setClientType] = useState<string>("all")
  const [riskLevel, setRiskLevel] = useState<string>("all")
  const [minLoan, setMinLoan] = useState<number[]>([0])
  const [maxLoan, setMaxLoan] = useState<number[]>([10000000])

  const resetFilters = () => {
    setClientType("all")
    setRiskLevel("all")
    setMinLoan([0])
    setMaxLoan([10000000])
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4" />
            <span className="sr-only">Réinitialiser</span>
          </Button>
        </div>
        <CardDescription>Affinez votre recherche de clients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche par nom</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="search" type="search" placeholder="Rechercher..." className="pl-8" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Type de client</Label>
          <RadioGroup defaultValue={clientType} onValueChange={setClientType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal">
                Tous
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="font-normal">
                Banque
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="insurance" id="insurance" />
              <Label htmlFor="insurance" className="font-normal">
                Assurance
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="investment" id="investment" />
              <Label htmlFor="investment" className="font-normal">
                Investissement
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Niveau de risque</Label>
          <Select defaultValue={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Modéré</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Montant du prêt (min)</Label>
            <span className="text-sm text-muted-foreground">{minLoan[0].toLocaleString()} €</span>
          </div>
          <Slider min={0} max={10000000} step={100000} value={minLoan} onValueChange={setMinLoan} className="py-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Montant du prêt (max)</Label>
            <span className="text-sm text-muted-foreground">{maxLoan[0].toLocaleString()} €</span>
          </div>
          <Slider min={0} max={10000000} step={100000} value={maxLoan} onValueChange={setMaxLoan} className="py-2" />
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Filter className="mr-2 h-4 w-4" />
          Appliquer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}

// Composant Search manquant dans le code original
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
