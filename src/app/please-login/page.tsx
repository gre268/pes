"use client"; // Este archivo se ejecuta en el cliente
import styles from "./please-login.module.css"; // Importa los estilos específicos para esta página
import { useRouter } from "next/navigation"; // Importa el hook para manejar la navegación

export default function PleaseLogin() {
  const router = useRouter(); // Hook para manejar redirecciones

  const handleLoginRedirect = () => {
    router.push("/login"); // Redirige al módulo de inicio de sesión
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Por favor inicie sesión para ingresar al módulo requerido</h1>
        <button onClick={handleLoginRedirect} className={styles.loginButton}>
          Iniciar Sesión
        </button>
      </div>
    </main>
  );
}
