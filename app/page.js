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

  return (
    <>
      <div id="hud">
        <div>Distância: <span id="dist">0</span>m</div>
        <div>Moedas: <span id="coins">0</span></div>
      </div>

      <canvas ref={canvasRef} />

      <div id="gameOver">
        <h2>💥 FIM DE JOGO</h2>
        <p id="finalScore"></p>
        <button onClick={() => location.reload()}>Jogar novamente</button>
      </div>
    </>
  )
}
