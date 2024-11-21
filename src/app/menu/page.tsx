"use client"; // Este código se ejecuta en el navegador (cliente).
import styles from "./menu.module.css"; // Importamos los estilos CSS para el componente del menú.
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar la navegación entre páginas.
import { useEffect } from "react"; // Importamos useEffect para manejar efectos secundarios.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importamos el componente de Font Awesome para React.
import { faUser, faClipboardCheck, faFlag, faDoorOpen, faPen } from "@fortawesome/free-solid-svg-icons"; // Importamos los íconos necesarios de Font Awesome.

export default function Menu() {
  const router = useRouter(); // Hook para manejar redirecciones.

  // Validar si el usuario está autenticado y controlar acceso mediante variableModulo
  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Obtiene el ID del usuario del localStorage.
    const variableModulo = localStorage.getItem("variableModulo"); // Obtiene la variable adicional para controlar el acceso.

    console.log("userID:", userID); // Depuración: Verifica el ID del usuario.
    console.log("variableModulo:", variableModulo); // Depuración: Verifica el valor de variableModulo.

    if (!userID || userID === "0") {
      // Si no hay sesión iniciada (userID es nulo o 0), redirige a "Por favor inicie sesión".
      router.push("/please-login");
      return;
    }

    if (variableModulo === "1") { // variableModulo incrementa en 1 cuando se ingresa al modulo para registrar una opinion
      // Si variableModulo es igual a "1", redirige a "Acceso Prohibido".
      router.push("/access-denied");
      return;
    }
  }, []);

  const handleAdminUsuarios = () => {
    router.push("/user"); // Redirige a la gestión de usuarios.
  };

  const handleGestionarOpiniones = () => {
    router.push("/gestionOpinion"); // Redirige a la gestión de opiniones.
  };

  const handleOpinion = () => {
    // Cuando el usuario entra al módulo de registrar opiniones, establece variableModulo en "1".
    localStorage.setItem("variableModulo", "1");
    router.push("/opinion"); // Redirige al registro de opiniones.
  };

  const handleReportes = () => {
    router.push("/dashboard"); // Redirige al módulo de reportes.
  };

  const handleLogout = () => {
    // Muestra una confirmación antes de cerrar sesión.
    const confirmLogout = window.confirm("¿Está seguro de que desea cerrar sesión?");
    if (confirmLogout) {
      alert("Gracias por utilizar el sistema"); // Muestra un mensaje de despedida.
      localStorage.removeItem("userID"); // Limpia el ID del usuario de localStorage.
      localStorage.removeItem("variableModulo"); // Limpia la variable adicional de localStorage.
      router.push("/login"); // Redirige al login.
    }
  };

  return (
    <main className={styles.main}> {/* Contenedor principal del menú */}
      <div className={styles.headerText}>
        <h1>Opinion Website</h1> {/* Título principal del sitio */}
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2> {/* Subtítulo con el nombre de la escuela */}
      </div>

      <div className={styles.menuContainer}> {/* Contenedor del menú principal */}
        <h3 className={styles.menuTitle}>Menú Principal</h3> {/* Título del menú */}

        <div className={styles.gridContainer}> {/* Contenedor en cuadrícula para organizar los íconos y botones */}
          
          {/* Administrar Usuarios */}
          <div className={styles.menuItem}>
            <div className={styles.iconPlaceholder}> {/* Contenedor para el ícono */}
              <FontAwesomeIcon icon={faUser} className={styles.icon} /> {/* Ícono de "Administrar Usuarios" */}
            </div>
            <button
              className={styles.menuButton} 
              title="En esta opción se puede administrar y gestionar las cuentas de los usuarios." /* Tooltip que explica la función del botón */
              onClick={handleAdminUsuarios} /* Redirige al módulo de Gestión de Usuarios */
            >
              Administrar Usuarios {/* Texto del botón */}
            </button>
          </div>

          {/* Gestionar Opiniones */}
          <div className={styles.menuItem}>
            <div className={styles.iconPlaceholder}> {/* Contenedor para el ícono */}
              <FontAwesomeIcon icon={faClipboardCheck} className={styles.icon} /> {/* Ícono de "Gestionar Opiniones" */}
            </div>
            <button
              className={styles.menuButton}
              title="En esta opción se puede gestionar todas las opiniones registradas." /* Tooltip que explica la función del botón */
              onClick={handleGestionarOpiniones} /* Redirige al módulo de Gestión de Opiniones */
            >
              Gestionar Opiniones {/* Texto del botón */}
            </button>
          </div>

          {/* Reportes */}
          <div className={styles.menuItem}>
            <div className={styles.iconPlaceholder}> {/* Contenedor para el ícono */}
              <FontAwesomeIcon icon={faFlag} className={styles.icon} /> {/* Ícono de "Reportes" */}
            </div>
            <button
              className={styles.menuButton}
              title="En esta opción se pueden generar reportes detallados a partir de las opiniones." /* Tooltip que explica la función del botón */
              onClick={handleReportes} /* Redirige al módulo de Reportes */
            >
              Reportes {/* Texto del botón */}
            </button>
          </div>

          {/* Sección inferior: Salir y Registrar Opinión */}
          <div className={styles.gridContainerTwoButtons}> {/* Contenedor de los botones inferiores (Salir y Registrar Opinión) */}
            
            {/* Salir */}
            <div className={styles.menuItem}>
              <div className={styles.iconPlaceholder}> {/* Contenedor para el ícono */}
                <FontAwesomeIcon icon={faDoorOpen} className={styles.icon} /> {/* Ícono de "Salir" */}
              </div>
              <button
                className={styles.menuButton}
                title="Cerrar sesión y salir del sistema." /* Tooltip que explica la función del botón */
                onClick={handleLogout} /* Redirige al login */
              >
                Salir {/* Texto del botón */}
              </button>
            </div>

            {/* Registrar Opinión*/}
            <div className={styles.menuItem}>
              <div className={styles.iconPlaceholder}> {/* Contenedor para el ícono */}
                <FontAwesomeIcon icon={faPen} className={styles.icon} /> {/* Ícono de "Registrar Opinión" */}
              </div>
              <button
                className={styles.menuButton}
                title="En esta opción se puede registrar una nueva opinión en representación de un padre o madre de familia." /* Tooltip que explica la función del botón */
                onClick={handleOpinion} /* Redirige al módulo de Registro de Opiniones */
              >
                Registrar Opinión {/* Texto del botón */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
