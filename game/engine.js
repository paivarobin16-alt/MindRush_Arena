export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  const lanes = [
    canvas.width / 2 - 120,
    canvas.width / 2,
    canvas.width / 2 + 120
  ]

  let baseSpeed = 6
  let speed = baseSpeed
  let distance = 0
  let coinsCount = 0

  // NITRO
  let nitro = 100
  let nitroActive = false

  // POLÍCIA
  let policeActive = false
  let policeDistance = 0

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
      y: -120,
      w: 50,
      h: 90,
      type: "car"
    })
  }

  function spawnPolice() {
    traffic.push({
      lane: Math.floor(Math.random() * 3),
      y: -200,
      w: 55,
      h: 100,
      type: "police"
    })
  }

  function spawnCoin() {
    coins.push({
      lane: Math.floor(Math.random() * 3),
      y: -50,
      r: 12
    })
  }

  function drawRoad() {
    ctx.fillStyle = "#111"
    ctx.fillRect(canvas.width / 2 - 200, 0, 400, canvas.height)

    ctx.strokeStyle = "#fff"
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])
  }

  function drawHUD() {
    ctx.fillStyle = "#fff"
    ctx.font = "18px Arial"
    ctx.fillText("Distância: " + Math.floor(distance) + " m", 20, 30)
    ctx.fillText("Moedas: " + coinsCount, 20, 55)

    // Barra de nitro
    ctx.fillStyle = "#333"
    ctx.fillRect(20, 75, 120, 10)
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(20, 75, nitro * 1.2, 10)

    if (policeActive) {
      ctx.fillStyle = "#f43f5e"
      ctx.fillText("🚓 POLÍCIA NA COLA!", 20, 105)
    }
  }

  function gameOver(msg) {
    alert(msg + "\nDistância: " + Math.floor(distance) + " m")
    window.location.reload()
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // efeito velocidade
    if (nitroActive) {
      ctx.save()
      ctx.translate(Math.random() * 2, Math.random() * 2)
    }

    drawRoad()

    // jogador
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(lanes[player.lane] - 25, player.y, player.w, player.h)

    // trânsito
    traffic.forEach((c, i) => {
      c.y += speed

      ctx.fillStyle = c.type === "police" ? "#ef4444" : "#f43f5e"
      ctx.fillRect(lanes[c.lane] - 25, c.y, c.w, c.h)

      if (
        c.lane === player.lane &&
        c.y + c.h > player.y &&
        c.y < player.y + player.h
      ) {
        gameOver(c.type === "police" ? "🚓 A polícia te pegou!" : "💥 Bateu!")
      }

      if (c.y > canvas.height + 200) traffic.splice(i, 1)
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
        coinsCount++
        nitro = Math.min(100, nitro + 5)
      }
    })

    // lógica polícia
    if (distance > 300 && !policeActive) policeActive = true
    if (policeActive && Math.random() < 0.015) spawnPolice()

    // spawns
    if (Math.random() < 0.03) spawnCar()
    if (Math.random() < 0.04) spawnCoin()

    // nitro
    if (nitroActive && nitro > 0) {
      speed = baseSpeed * 1.8
      nitro -= 1
    } else {
      nitroActive = false
      speed = baseSpeed
    }

    baseSpeed += 0.0015
    distance += speed / 10

    drawHUD()

    if (nitroActive) ctx.restore()

    requestAnimationFrame(loop)
  }

  // CONTROLES
  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    // metade inferior = trocar pista
    if (y > canvas.height * 0.6) {
      if (x < canvas.width / 2)
        player.lane = Math.max(0, player.lane - 1)
      else player.lane = Math.min(2, player.lane + 1)
    } else {
      // metade superior = nitro
      if (nitro > 10) nitroActive = true
    }
  })

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.lane = Math.max(0, player.lane - 1)
    if (e.key === "ArrowRight") player.lane = Math.min(2, player.lane + 1)
    if (e.key === " " && nitro > 10) nitroActive = true
  })

  loop()
}
