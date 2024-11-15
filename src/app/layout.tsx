import type { Metadata } from "next"; // Importamos el tipo Metadata para definir los metadatos del sitio (título, descripción).
import { Inter } from "next/font/google"; // Importamos la fuente Inter desde Google Fonts para aplicar un estilo de fuente global.
import "./globals.css"; // Importamos el archivo de estilos CSS global para aplicar estilos generales en toda la aplicación.
import Link from "next/link"; // Importamos el componente Link de Next.js, útil para crear enlaces internos.

const inter = Inter({ subsets: ["latin"] }); // Configuramos la fuente Inter con el subconjunto latino, que es adecuado para idiomas como español e inglés.

export const metadata: Metadata = {
  title: "OpinionWebSite", // Define el título de la página que se mostrará en la pestaña del navegador.
  description: "Greivin Carrillo", // Proporciona una descripción de la aplicación que puede ser útil para SEO.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Define que el prop `children` será de tipo React.ReactNode, permitiendo que se pase cualquier elemento React.
}) {
  return (
    <html lang="en"> {/* Define el idioma principal de la página como inglés, esto ayuda con la accesibilidad y SEO. */}
      <head>
        {/* No se incluye ningún favicon, lo que significa que no se mostrará ningún ícono en la pestaña del navegador. */}
      </head>
      <body className={inter.className}> {/* Aplica la clase de la fuente Inter al body para estilizar todo el contenido con esa fuente. */}
        {/* Logo en la esquina superior izquierda */}
        <header>
          <Link href="/"> {/* Enlace que redirige a la página de inicio cuando el usuario hace clic en el logo o el header */}
          </Link>
        </header>
        {/* Renderiza el contenido de las diferentes páginas */}
        {children}
      </body>
    </html>
  );
}
