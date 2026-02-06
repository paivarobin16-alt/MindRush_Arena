export function generateChallenge() {
  const type = Math.floor(Math.random() * 3)

  if (type === 0) {
    const a = Math.floor(Math.random() * 10)
    const b = Math.floor(Math.random() * 10)
    return {
      question: `${a} + ${b} = ?`,
      options: shuffle([a + b, a + b + 1, a + b - 1]),
      answer: a + b
    }
  }

  if (type === 1) {
    const correct = Math.floor(Math.random() * 20)
    return {
      question: "Clique no número correto",
      options: shuffle([
        correct,
        correct + 2,
        correct - 3,
        correct + 5
      ]),
      answer: correct
    }
  }

  const seq = [2, 4, 6]
  return {
    question: "Qual o próximo número? 2, 4, 6, ?",
    options: shuffle([8, 10, 6, 12]),
    answer: 8
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
        }
