"use client"; // Este archivo se ejecuta en el cliente
import styles from "./please-login.module.css"; // Importa los estilos específicos de esta página.
import { useEffect } from "react"; // Importa useEffect para manejar efectos secundarios.
import { useRouter } from "next/navigation"; // Hook para manejar redirecciones.

export default function PleaseLogin() {
  const router = useRouter(); // Hook para manejar redirecciones.

  useEffect(() => {
    // Limpia las variables de localStorage al cargar esta página
    localStorage.removeItem("userID"); // Elimina el ID del usuario de localStorage.
    localStorage.removeItem("userRole"); // Elimina el rol del usuario de localStorage.
    localStorage.removeItem("variableModulo"); // Elimina la variable adicional de control de acceso.
  }, []); // Solo se ejecuta una vez, al cargar el componente.

  const handleLoginRedirect = () => {
    router.push("/login"); // Redirige al módulo de inicio de sesión.
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Por favor inicie sesión para ingresar al módulo requerido</h1> {/* Título de la página */}
        <button onClick={handleLoginRedirect} className={styles.loginButton}>
          Iniciar Sesión {/* Botón que redirige al login */}
        </button>
      </div>
    </main>
  );
}
