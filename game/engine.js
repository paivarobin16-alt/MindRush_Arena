export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  const roadWidth = 280
  const laneWidth = roadWidth / 3
  const roadX = canvas.width / 2 - roadWidth / 2

  const playerImg = new Image()
  playerImg.src = "/sprites/car-player.svg"

  const enemyImg = new Image()
  enemyImg.src = "/sprites/car-enemy.svg"

  const coinImg = new Image()
  coinImg.src = "/sprites/coin.svg"

  let speed = 5
  let distance = 0
  let coins = 0
  let running = true

  const player = {
    lane: 1,
    y: canvas.height - 160,
    w: 50,
    h: 100
  }

  const enemies = []
  const coinsArr = []

  function laneX(lane) {
    return roadX + lane * laneWidth + laneWidth / 2 - 25
  }

  function spawnEnemy() {
    enemies.push({
      lane: Math.floor(Math.random() * 3),
      y: -120
    })
  }

  function spawnCoin() {
    coinsArr.push({
      lane: Math.floor(Math.random() * 3),
      y: -40
    })
  }

  function gameOver() {
    running = false
    document.getElementById("finalScore").innerText =
      `Distância: ${Math.floor(distance)}m`
    document.getElementById("gameOver").style.display = "flex"
  }

  function loop() {
    if (!running) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // estrada
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(roadX, 0, roadWidth, canvas.height)

    ctx.strokeStyle = "#e5e7eb"
    ctx.setLineDash([30, 25])
    ctx.lineDashOffset = -distance * 3

    for (let i = 1; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(roadX + i * laneWidth, 0)
      ctx.lineTo(roadX + i * laneWidth, canvas.height)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // player
    ctx.drawImage(playerImg, laneX(player.lane), player.y, player.w, player.h)

    // inimigos
    enemies.forEach((e, i) => {
      e.y += speed
      ctx.drawImage(enemyImg, laneX(e.lane), e.y, 50, 100)

      if (
        e.lane === player.lane &&
        e.y + 90 > player.y &&
        e.y < player.y + player.h
      ) {
        gameOver()
      }

      if (e.y > canvas.height) enemies.splice(i, 1)
    })

    // moedas
    coinsArr.forEach((c, i) => {
      c.y += speed
      ctx.drawImage(coinImg, laneX(c.lane) + 10, c.y, 30, 30)

      if (
        c.lane === player.lane &&
        c.y > player.y &&
        c.y < player.y + player.h
      ) {
        coins++
        coinsArr.splice(i, 1)
      }
    })

    if (Math.random() < 0.025) spawnEnemy()
    if (Math.random() < 0.035) spawnCoin()

    speed += 0.002
    distance += speed / 10

    document.getElementById("dist").innerText = Math.floor(distance)
    document.getElementById("coins").innerText = coins

    requestAnimationFrame(loop)
  }

  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX
    if (x < canvas.width / 2)
      player.lane = Math.max(0, player.lane - 1)
    else
      player.lane = Math.min(2, player.lane + 1)
  })

  loop()
}
