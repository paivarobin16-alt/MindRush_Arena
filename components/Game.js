"use client"
import { useEffect, useState } from "react"
import { generateChallenge } from "../utils/challenges"

export default function Game() {
  const [challenge, setChallenge] = useState(generateChallenge())
  const [time, setTime] = useState(10)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t - 1)
    }, 1000)

    if (time <= 0) {
      alert(`Fim de jogo! Pontuação: ${score}`)
      window.location.reload()
    }

    return () => clearInterval(timer)
  }, [time])

  function selectOption(opt) {
    if (opt === challenge.answer) {
      setScore(score + 1)
      setTime(10)
      setChallenge(generateChallenge())
    } else {
      setTime(t => t - 2)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>⏱️ Tempo: {time}s</h2>
      <h3>🏆 Pontos: {score}</h3>

      <h1 style={{ margin: "20px 0" }}>{challenge.question}</h1>

      {challenge.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => selectOption(opt)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
