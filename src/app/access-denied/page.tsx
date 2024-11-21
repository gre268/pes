"use client";
import styles from "./access-denied.module.css"; // Importa los estilos específicos de esta página.
import { useEffect } from "react"; // Importa useEffect para manejar efectos secundarios.
import { useRouter } from "next/navigation"; // Hook para manejar redirecciones.

export default function AccessDenied() {
  const router = useRouter();

  useEffect(() => {
    // Limpia el localStorage al cargar esta página
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
  }, []);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Acceso Prohibido</h1>
        <p>No tiene permisos para acceder a este módulo. Su sesión ha sido cerrada.</p>
        <button onClick={handleLoginRedirect} className={styles.loginButton}>
          Iniciar Sesión
        </button>
      </div>
    </main>
  );
}
