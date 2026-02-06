import "./globals.css"

export const metadata = {
  title: "Neon Dash Runner",
  description: "Corrida arcade futurista infinita"
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
