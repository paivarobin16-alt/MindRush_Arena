export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  const roadWidth = 300
  const laneWidth = roadWidth / 3
  const roadX = canvas.width / 2 - roadWidth / 2

  let speed = 6
  let distance = 0
  let coins = 0
  let nitro = 100

  const player = {
    lane: 1,
    y: canvas.height - 140,
    w: 50,
    h: 90
  }

  const cars = []
  const coinsArr = []

  function laneX(lane) {
    return roadX + lane * laneWidth + laneWidth / 2
  }

  function drawRoad() {
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(roadX, 0, roadWidth, canvas.height)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 3
    ctx.setLineDash([25, 20])
    ctx.lineDashOffset = -distance * 4

    for (let i = 1; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(roadX + i * laneWidth, 0)
      ctx.lineTo(roadX + i * laneWidth, canvas.height)
      ctx.stroke()
    }

    ctx.setLineDash([])
  }

  function drawCar(x, y, w, h, color) {
    // sombra
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.fillRect(x - w / 2 + 5, y + h - 5, w - 10, 10)

    // corpo
    ctx.fillStyle = color
    ctx.fillRect(x - w / 2, y, w, h)

    // vidro
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.fillRect(x - w / 2 + 8, y + 15, w - 16, 25)
  }

  function spawnCar() {
    cars.push({
      lane: Math.floor(Math.random() * 3),
      y: -120
    })
  }

  function spawnCoin() {
    coinsArr.push({
      lane: Math.floor(Math.random() * 3),
      y: -50
    })
  }

  function gameOver() {
    alert(`💥 BATEU!\nDistância: ${Math.floor(distance)}m`)
    location.reload()
  }

  function drawHUD() {
    ctx.fillStyle = "#fff"
    ctx.font = "16px Arial"
    ctx.fillText(`Distância: ${Math.floor(distance)}m`, 20, 30)
    ctx.fillText(`Moedas: ${coins}`, 20, 55)

    ctx.fillStyle = "#334155"
    ctx.fillRect(20, 70, 120, 8)
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(20, 70, nitro * 1.2, 8)
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawRoad()

    // jogador
    drawCar(
      laneX(player.lane),
      player.y,
      player.w,
      player.h,
      "#22d3ee"
    )

    // carros
    cars.forEach((c, i) => {
      c.y += speed
      drawCar(
        laneX(c.lane),
        c.y,
        50,
        90,
        "#ef4444"
      )

      if (
        c.lane === player.lane &&
        c.y + 90 > player.y &&
        c.y < player.y + player.h
      ) {
        gameOver()
      }

      if (c.y > canvas.height + 100) cars.splice(i, 1)
    })

    // moedas
    coinsArr.forEach((m, i) => {
      m.y += speed
      ctx.fillStyle = "#facc15"
      ctx.beginPath()
      ctx.arc(laneX(m.lane), m.y, 10, 0, Math.PI * 2)
      ctx.fill()

      if (
        m.lane === player.lane &&
        m.y > player.y &&
        m.y < player.y + player.h
      ) {
        coins++
        nitro = Math.min(100, nitro + 10)
        coinsArr.splice(i, 1)
      }
    })

    if (Math.random() < 0.03) spawnCar()
    if (Math.random() < 0.04) spawnCoin()

    speed += 0.002
    distance += speed / 10

    drawHUD()

    requestAnimationFrame(loop)
  }

  // CONTROLES
  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX
    if (x < canvas.width / 2)
      player.lane = Math.max(0, player.lane - 1)
    else
      player.lane = Math.min(2, player.lane + 1)
  })

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.lane = Math.max(0, player.lane - 1)
    if (e.key === "ArrowRight") player.lane = Math.min(2, player.lane + 1)
  })

  loop()
}
