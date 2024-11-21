"use client"; // Este archivo se ejecuta en el cliente
import styles from "./access-denied.module.css"; // Importa los estilos específicos para esta página
import { useRouter } from "next/navigation"; // Importa el hook para manejar la navegación

export default function AccessDenied() {
  const router = useRouter(); // Hook para manejar redirecciones

  const handleGoBack = () => {
    router.push("/opinion"); // Redirige al módulo de registro de opinión
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Acceso Prohibido</h1>
        <p>No tiene permisos para acceder a este módulo.</p>
        <button onClick={handleGoBack} className={styles.backButton}>
          Volver
        </button>
      </div>
    </main>
  );
}
