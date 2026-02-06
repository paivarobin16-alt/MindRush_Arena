import "./globals.css"

export const metadata = {
  title: "Urban Drift Rush",
  description: "Corrida urbana infinita estilo arcade"
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
