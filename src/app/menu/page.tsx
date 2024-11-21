"use client"; // Este código se ejecuta en el navegador (cliente).
import styles from "./menu.module.css"; // Importamos los estilos CSS para el componente del menú.
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar la navegación entre páginas.
import { useEffect } from "react"; // Importamos useEffect para manejar efectos secundarios si es necesario.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importamos el componente de Font Awesome para React.
import { faUser, faClipboardCheck, faFlag, faDoorOpen, faPen } from "@fortawesome/free-solid-svg-icons"; // Importamos los iconos necesarios de Font Awesome.

export default function Menu() {
  const router = useRouter(); // Hook que permite manejar la redirección a otras rutas de la aplicación.

  // Validar si el usuario está autenticado
  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Obtiene el ID del usuario del localStorage.

    console.log("userID:", userID); // Verifica el ID del usuario en consola para depuración.

    if (!userID || userID === "0") {
      // Si el userID no está definido o es igual a "0", redirige a la página "Por favor inicie sesión".
      router.push("/please-login");
      return;
    }
  }, []);

  // Función que redirige a la página de gestión de usuarios.
  const handleAdminUsuarios = () => {
    router.push("/user"); // Navega a la página de gestión de usuarios cuando el usuario hace clic en el botón.
  };

  // Función que redirige a la página de gestión de opiniones.
  const handleGestionarOpiniones = () => {
    router.push("/gestionOpinion"); // Navega a la página de gestión de opiniones cuando el usuario hace clic en el botón.
  };

  // Función que redirige a la página para registrar una nueva opinión.
  const handleOpinion = () => {
    router.push("/opinion"); // Navega a la página de registro de opiniones cuando el usuario hace clic en el botón.
  };

  // Función que redirige a la página de reportes.
  const handleReportes = () => {
    router.push("/dashboard"); // Navega a la página de reportes cuando el usuario hace clic en el botón.
  };

  // Función que maneja el cierre de sesión.
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema"); // Muestra un mensaje de despedida.
    localStorage.removeItem("userID"); // Limpia el userID del localStorage.
    localStorage.removeItem("userRole"); // Limpia el rol del usuario del localStorage.
    router.push("/login"); // Redirige al usuario a la página de inicio de sesión.
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
                title="En esta opción se puede salir del sistema y regresar a la pantalla de inicio de sesión." /* Tooltip que explica la función del botón */
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
