import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Asegúrate de tener el archivo CSS global
import Link from "next/link"; // Importa Link si planeas usarlo para el logo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpinionWebSite",
  description: "Greivin Carrillo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Logo en la esquina superior izquierda */}
        <header>
          <Link href="/"> {/* Puedes usar este enlace para redirigir al usuario al inicio */}
          </Link>
        </header>
        {/* Contenido de las páginas */}
        {children}
      </body>
    </html>
  );
}
