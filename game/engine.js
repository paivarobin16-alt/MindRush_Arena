export function startGame(canvas) {
  const ctx = canvas.getContext("2d")

  let speed = 5
  let score = 0

  const player = {
    x: 80,
    y: 200,
    size: 30,
    vy: 0,
    jump() {
      if (this.y >= 200) this.vy = -15
    }
  }

  const obstacles = []

  function spawnObstacle() {
    obstacles.push({
      x: canvas.width,
      y: 220,
      w: 30,
      h: 30
    })
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // chão
    ctx.fillStyle = "#0ff"
    ctx.fillRect(0, 260, canvas.width, 5)

    // player
    ctx.fillStyle = "#38bdf8"
    ctx.fillRect(player.x, player.y, player.size, player.size)

    // física
    player.vy += 1
    player.y += player.vy
    if (player.y > 200) {
      player.y = 200
      player.vy = 0
    }

    // obstáculos
    obstacles.forEach(o => {
      o.x -= speed
      ctx.fillStyle = "#f43f5e"
      ctx.fillRect(o.x, o.y, o.w, o.h)

      // colisão
      if (
        player.x < o.x + o.w &&
        player.x + player.size > o.x &&
        player.y < o.y + o.h &&
        player.y + player.size > o.y
      ) {
        alert("Game Over! Pontuação: " + Math.floor(score))
        window.location.reload()
      }
    })

    if (Math.random() < 0.02) spawnObstacle()

    speed += 0.001
    score += 0.1

    ctx.fillStyle = "#fff"
    ctx.fillText("Score: " + Math.floor(score), 20, 30)

    requestAnimationFrame(loop)
  }

  canvas.addEventListener("click", () => player.jump())
  loop()
}
