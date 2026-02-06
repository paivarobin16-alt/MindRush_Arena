export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  const lanes = [
    canvas.width / 2 - 120,
    canvas.width / 2,
    canvas.width / 2 + 120
  ]

  let speed = 6
  let score = 0
  let distance = 0

  const player = {
    lane: 1,
    y: canvas.height - 160,
    w: 50,
    h: 90
  }

  const traffic = []
  const coins = []

  function spawnCar() {
    traffic.push({
      lane: Math.floor(Math.random() * 3),
      y: -100,
      w: 50,
      h: 90
    })
  }

  function spawnCoin() {
    coins.push({
      lane: Math.floor(Math.random() * 3),
      y: -50,
      r: 12
    })
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // estrada
    ctx.fillStyle = "#111"
    ctx.fillRect(canvas.width / 2 - 200, 0, 400, canvas.height)

    // faixas
    ctx.strokeStyle = "#fff"
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // jogador
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(lanes[player.lane] - 25, player.y, player.w, player.h)

    // trânsito
    traffic.forEach(c => {
      c.y += speed
      ctx.fillStyle = "#f43f5e"
      ctx.fillRect(lanes[c.lane] - 25, c.y, c.w, c.h)

      if (
        lanes[c.lane] === lanes[player.lane] &&
        c.y + c.h > player.y &&
        c.y < player.y + player.h
      ) {
        alert("💥 Bateu! Distância: " + Math.floor(distance) + "m")
        window.location.reload()
      }
    })

    // moedas
    coins.forEach((m, i) => {
      m.y += speed
      ctx.fillStyle = "#facc15"
      ctx.beginPath()
      ctx.arc(lanes[m.lane], m.y, m.r, 0, Math.PI * 2)
      ctx.fill()

      if (
        m.lane === player.lane &&
        m.y > player.y &&
        m.y < player.y + player.h
      ) {
        coins.splice(i, 1)
        score += 10
      }
    })

    if (Math.random() < 0.03) spawnCar()
    if (Math.random() < 0.04) spawnCoin()

    speed += 0.002
    distance += speed / 10

    ctx.fillStyle = "#fff"
    ctx.font = "20px Arial"
    ctx.fillText("Distância: " + Math.floor(distance) + " m", 20, 30)
    ctx.fillText("Moedas: " + score, 20, 60)

    requestAnimationFrame(loop)
  }

  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX
    if (x < canvas.width / 2) player.lane = Math.max(0, player.lane - 1)
    else player.lane = Math.min(2, player.lane + 1)
  })

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.lane = Math.max(0, player.lane - 1)
    if (e.key === "ArrowRight") player.lane = Math.min(2, player.lane + 1)
  })

  loop()
}
