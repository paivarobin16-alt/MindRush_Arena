"use client"
import { useEffect, useRef } from "react"
import { startGame } from "../game/engine"

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    startGame(canvas)
  }, [])

  return <canvas ref={canvasRef} />
}
