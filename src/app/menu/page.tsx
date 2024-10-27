"use client"; // Indicamos que este código se ejecuta en el cliente (renderizado en el navegador)
import styles from "./menu.module.css"; // Importamos los estilos CSS específicos para este módulo
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar las redirecciones entre páginas
import { useEffect } from "react"; // Importamos useEffect para manejar los efectos secundarios

export default function Menu() {
  const router = useRouter(); // Hook para manejar la redirección entre las diferentes páginas del sistema

  useEffect(() => {
    // Este useEffect se asegura de que no haya acceso prematuro al DOM antes de que el componente esté montado
    // Aquí podríamos manejar cualquier lógica adicional si fuera necesario
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  // Función que redirige al módulo de Gestión de Usuarios
  const handleAdminUsuarios = () => {
    router.push("/user"); // Redirigimos al módulo de Gestión de Usuarios cuando se hace clic en "Administrar Usuarios"
  };

  // Función que redirige al módulo de Gestión de Opiniones
  const handleGestionarOpiniones = () => {
    router.push("/gestionOpinion"); // Redirigimos al módulo de Gestión de Opiniones cuando se hace clic en "Gestionar Opiniones"
  };

  // Función que redirige al módulo de Opinión (Registrar Opiniones)
  const handleOpinion = () => {
    router.push("/opinion"); // Redirigimos al módulo de Opinión cuando se hace clic en "Registrar Opinión"
  };

  // Función que redirige al módulo de Reportes
  const handleReportes = () => {
    router.push("/report"); // Redirigimos al módulo de Reportes cuando se hace clic en "Reportes"
  };

  // Función que redirige al login y muestra un mensaje de salida
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema"); // Mostramos un mensaje de despedida al hacer clic en "Salir"
    router.push("/login"); // Redirigimos al login después de mostrar el mensaje
  };

  return (
    <main className={styles.main}> {/* Contenedor principal */}
      <div className={styles.headerText}> {/* Sección del título */}
        <h1>Opinion Website</h1> {/* Título principal de la página */}
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2> {/* Subtítulo con el nombre de la escuela */}
      </div>

      <div className={styles.menuContainer}> {/* Contenedor para el menú principal */}
        <h3 className={styles.menuTitle}>Menú Principal</h3> {/* Título de la sección del menú */}

        <div className={styles.gridContainer}> {/* Contenedor en cuadrícula para organizar los íconos y botones */}
          
          {/* Administrar Usuarios */}
          <div className={styles.menuItem}>
            <div className={styles.iconPlaceholder}> {/* Espacio para el icono */}
              <img src="/images/user-management-icon.png" alt="Icono de usuarios" className={styles.icon} /> {/* Icono de "Administrar Usuarios" */}
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
            <div className={styles.iconPlaceholder}> {/* Espacio para el icono */}
              <img src="/images/opinion-management-icon.png" alt="Icono de opiniones" className={styles.icon} /> {/* Icono de "Gestionar Opiniones" */}
            </div>
            <button
              className={styles.menuButton}
              title="En esta opción se puede gestionar todas las opiniones registradas." /* Tooltip que explica la función del botón */
              onClick={handleGestionarOpiniones} /* Redirige al módulo de Gestión de Opiniones */
            >
              Gestionar Opiniones {/* Texto del botón actualizado */}
            </button>
          </div>

          {/* Reportes */}
          <div className={styles.menuItem}>
            <div className={styles.iconPlaceholder}> {/* Espacio para el icono */}
              <img src="/images/reports-icon.png" alt="Icono de reportes" className={styles.icon} /> {/* Icono de "Reportes" */}
            </div>
            <button
              className={styles.menuButton}
              title="En esta opción se pueden generar reportes detallados a partir de las opiniones." /* Tooltip que explica la función del botón */
              onClick={handleReportes} /* Redirige al módulo de Reportes */
            >
              Reportes {/* Texto del botón */}
            </button>
          </div>

          {/* Botones de la parte inferior (Salir y Registrar Opinión) */}
          <div className={styles.gridContainerTwoButtons}> {/* Contenedor para centrar los dos botones inferiores */}
            
            {/* Salir */}
            <div className={styles.menuItem}>
              <div className={styles.iconPlaceholder}> {/* Espacio para el icono */}
                <img src="/images/logout-icon.png" alt="Icono de salir" className={styles.icon} /> {/* Icono de "Salir" */}
              </div>
              <button
                className={styles.menuButton}
                title="En esta opción se puede salir del sistema y regresar a la pantalla de inicio de sesión." /* Tooltip que explica la función del botón */
                onClick={handleLogout} /* Redirige al login */
              >
                Salir {/* Texto del botón */}
              </button>
            </div>

            {/* Registrar Opinión */}
            <div className={styles.menuItem}>
              <div className={styles.iconPlaceholder}> {/* Espacio para el icono */}
                <img src="/images/submit-opinion-icon.png" alt="Icono de sugerencias" className={styles.icon} /> {/* Icono de "Registrar Opinión" */}
              </div>
              <button
                className={styles.menuButton}
                title="En esta opción se puede registrar una nueva opinión en representación de un padre o madre de familia." /* Tooltip que explica la función del botón */
                onClick={handleOpinion} /* Redirige al módulo de Opinión */
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
