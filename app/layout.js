import "./globals.css"

export const metadata = {
  title: "MindRush Arena",
  description: "Desafie sua mente contra o tempo"
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
