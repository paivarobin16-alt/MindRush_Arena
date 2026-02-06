export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  const center = canvas.width / 2
  const roadWidth = 420

  const lanes = [-1, 0, 1]

  let speed = 8
  let distance = 0
  let coins = 0
  let nitro = 100
  let nitroActive = false

  const player = {
    lane: 0,
    y: canvas.height * 0.72,
    w: 50,
    h: 90
  }

  const cars = []
  const coinsArr = []
  let policeTimer = 0

  function laneX(lane, depth = 1) {
    return center + lane * 90 * depth
  }

  function drawRoad() {
    ctx.fillStyle = "#020617"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // estrada em perspectiva
    ctx.fillStyle = "#111"
    ctx.beginPath()
    ctx.moveTo(center - roadWidth / 2, canvas.height)
    ctx.lineTo(center + roadWidth / 2, canvas.height)
    ctx.lineTo(center + 40, 0)
    ctx.lineTo(center - 40, 0)
    ctx.closePath()
    ctx.fill()

    // faixas animadas
    ctx.strokeStyle = "#fff"
    ctx.setLineDash([30, 40])
    ctx.lineDashOffset = -distance * 5
    ctx.lineWidth = 3

    lanes.slice(0, 2).forEach(l => {
      ctx.beginPath()
      ctx.moveTo(center + l * 90, canvas.height)
      ctx.lineTo(center + l * 20, 0)
      ctx.stroke()
    })

    ctx.setLineDash([])
  }

  function drawCar(x, y, w, h, color, police = false) {
    // sombra
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.fillRect(x - w / 2 + 5, y + h - 5, w - 10, 10)

    // corpo
    ctx.fillStyle = color
    ctx.fillRect(x - w / 2, y, w, h)

    // vidro
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.fillRect(x - w / 2 + 8, y + 10, w - 16, 20)

    // luz polícia
    if (police) {
      ctx.fillStyle = Math.random() > 0.5 ? "#3b82f6" : "#ef4444"
      ctx.fillRect(x - 15, y - 8, 12, 6)
      ctx.fillRect(x + 3, y - 8, 12, 6)
    }
  }

  function spawnCar(type = "normal") {
    cars.push({
      lane: lanes[Math.floor(Math.random() * 3)],
      y: -100,
      type
    })
  }

  function spawnCoin() {
    coinsArr.push({
      lane: lanes[Math.floor(Math.random() * 3)],
      y: -50
    })
  }

  function drawHUD() {
    ctx.fillStyle = "#fff"
    ctx.font = "18px Arial"
    ctx.fillText("Distância: " + Math.floor(distance) + "m", 20, 30)
    ctx.fillText("Moedas: " + coins, 20, 55)

    // nitro
    ctx.fillStyle = "#333"
    ctx.fillRect(20, 70, 120, 10)
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(20, 70, nitro * 1.2, 10)
  }

  function gameOver(text) {
    alert(text + "\nDistância: " + Math.floor(distance))
    location.reload()
  }

  function loop() {
    if (nitroActive) {
      ctx.save()
      ctx.translate(Math.random() * 3, Math.random() * 3)
    }

    drawRoad()

    // jogador
    drawCar(
      laneX(player.lane, 1),
      player.y,
      player.w,
      player.h,
      "#22d3ee"
    )

    // carros
    cars.forEach((c, i) => {
      c.y += speed
      const depth = Math.min(1.4, 1 + c.y / canvas.height)
      const x = laneX(c.lane, depth)

      drawCar(
        x,
        c.y,
        player.w * depth,
        player.h * depth,
        c.type === "police" ? "#1e293b" : "#ef4444",
        c.type === "police"
      )

      if (
        Math.abs(x - laneX(player.lane, 1)) < 40 &&
        c.y + 80 > player.y &&
        c.y < player.y + player.h
      ) {
        gameOver(c.type === "police" ? "🚓 PRESO!" : "💥 BATEU!")
      }

      if (c.y > canvas.height + 200) cars.splice(i, 1)
    })

    // moedas
    coinsArr.forEach((m, i) => {
      m.y += speed
      const depth = 1 + m.y / canvas.height
      const x = laneX(m.lane, depth)

      ctx.fillStyle = "#facc15"
      ctx.beginPath()
      ctx.arc(x, m.y, 10 * depth, 0, Math.PI * 2)
      ctx.fill()

      if (
        Math.abs(x - laneX(player.lane, 1)) < 30 &&
        m.y > player.y &&
        m.y < player.y + player.h
      ) {
        coins++
        nitro = Math.min(100, nitro + 8)
        coinsArr.splice(i, 1)
      }
    })

    if (Math.random() < 0.03) spawnCar()
    if (Math.random() < 0.04) spawnCoin()

    // polícia após progresso
    policeTimer++
    if (distance > 300 && policeTimer > 300) {
      spawnCar("police")
      policeTimer = 0
    }

    speed += 0.003
    distance += speed / 10

    drawHUD()

    if (nitroActive && nitro > 0) {
      speed *= 1.03
      nitro -= 1
    } else {
      nitroActive = false
    }

    if (nitroActive) ctx.restore()

    requestAnimationFrame(loop)
  }

  // CONTROLES
  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    if (y > canvas.height * 0.6) {
      if (x < canvas.width / 2)
        player.lane = Math.max(-1, player.lane - 1)
      else player.lane = Math.min(1, player.lane + 1)
    } else {
      if (nitro > 10) nitroActive = true
    }
  })

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")
      player.lane = Math.max(-1, player.lane - 1)
    if (e.key === "ArrowRight")
      player.lane = Math.min(1, player.lane + 1)
    if (e.key === " ") nitroActive = true
  })

  loop()
}
