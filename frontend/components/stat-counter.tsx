"use client"

import { useState, useEffect, useRef } from "react"

interface StatCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

export default function StatCounter({ end, duration = 2, prefix = "", suffix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<number>(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const progress = (timestamp - startTimeRef.current) / (duration * 1000)

      if (progress < 1) {
        countRef.current = Math.floor(end * Math.min(progress, 1))
        setCount(countRef.current)
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration])

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
