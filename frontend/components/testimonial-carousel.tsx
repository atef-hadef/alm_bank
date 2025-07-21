"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    content:
      "La solution ALM nous a permis d'optimiser notre gestion des risques et d'améliorer notre prise de décision. L'interface est intuitive et les analyses sont précises.",
    author: "Marie Dupont",
    role: "Directrice des Risques, Banque Nationale",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    content:
      "Grâce à cette plateforme, nous avons pu anticiper plusieurs risques majeurs et adapter notre stratégie en conséquence. Un outil indispensable pour toute institution financière.",
    author: "Jean Martin",
    role: "Responsable ALM, Crédit Mutuel",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    content:
      "Les simulations de scénarios nous ont permis de tester différentes hypothèses et d'optimiser notre allocation de capital. Le support client est également excellent.",
    author: "Sophie Leclerc",
    role: "Analyste Financier, BNP Paribas",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src={testimonials[currentIndex].avatar || "/placeholder.svg"}
            alt={testimonials[currentIndex].author}
            width={60}
            height={60}
            className="rounded-full border-2 border-emerald-200"
          />
        </div>
        <blockquote className="mb-6 max-w-2xl text-lg italic text-muted-foreground">
          "{testimonials[currentIndex].content}"
        </blockquote>
        <div className="text-center">
          <div className="font-semibold">{testimonials[currentIndex].author}</div>
          <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-emerald-600" : "bg-emerald-200"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Voir témoignage ${index + 1}`}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2"
        onClick={prevTestimonial}
        aria-label="Témoignage précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={nextTestimonial}
        aria-label="Témoignage suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}
