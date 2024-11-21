"use client";
import styles from "./please-login.module.css"; // Importa los estilos específicos de esta página.
import { useRouter } from "next/navigation"; // Hook para manejar redirecciones.

export default function PleaseLogin() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    // Limpia localStorage antes de redirigir
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
    router.push("/login");
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
