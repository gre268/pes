"use client"; // Este archivo se ejecuta en el cliente
import styles from "./access-denied.module.css"; // Importa los estilos específicos para esta página
import { useEffect } from "react"; // Importa useEffect para manejar efectos secundarios
import { useRouter } from "next/navigation"; // Importa el hook para manejar redirecciones

export default function AccessDenied() {
  const router = useRouter(); // Hook para manejar redirecciones

  useEffect(() => {
    // Limpia el localStorage al llegar a esta página
    localStorage.removeItem("userID"); // Elimina el ID del usuario
    localStorage.removeItem("userRole"); // Elimina el rol del usuario
  }, []);

  const handleLoginRedirect = () => {
    // Redirige al usuario al módulo de inicio de sesión
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
