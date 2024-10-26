"use client"; // Indicamos que este archivo se ejecuta en el lado del cliente
import styles from "./report.module.css"; // Importamos los estilos desde report.module.css
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para redirigir entre páginas

// Definimos la estructura de una opinión (TypeScript)
type Opinion = {
  id: number;
  tipo: string; // Tipo de opinión (queja o sugerencia)
  descripcion: string; // Descripción de la opinión
  nombre: string; // Nombre del usuario que hizo la opinión
  estado: string; // Estado de la opinión (abierta o cerrada)
  fecha: string; // Fecha en la que se ingresó la opinión
};

export default function Reportes() {
  const [totals, setTotals] = useState({
    totalQuejas: 0, // Total de quejas
    totalQuejasCerradas: 0, // Total de quejas cerradas
    totalQuejasAbiertas: 0, // Total de quejas abiertas
    totalSugerencias: 0, // Total de sugerencias
    totalSugerenciasCerradas: 0, // Total de sugerencias cerradas
    totalSugerenciasAbiertas: 0, // Total de sugerencias abiertas
  });

  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones, ahora con el tipo definido como Opinion[]
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la tabla
  const opinionsPerPage = 10; // Cantidad de opiniones por página

  const router = useRouter(); // Hook para redirigir al hacer clic en el botón de menú o salir

  useEffect(() => {
    // Aquí podrías cargar datos de la base de datos para los totales y opiniones
    // setTotals({...}) para actualizar los valores de las quejas y sugerencias
    // setOpinions([...]) para actualizar la tabla con las opiniones
  }, []); // Este hook se ejecuta una vez cuando la página se carga

  // Función que maneja el botón "Salir"
  const handleLogout = () => {
    alert("Gracias por utilizar el sitio web de Opinion Website"); // Mostrar mensaje de agradecimiento
    router.push("/login"); // Redirigir a la página de login
  };

  // Función que maneja el botón "Menú"
  const handleMenu = () => {
    router.push("/menu"); // Redirigir a la página del menú
  };

  // Función para cambiar a la página siguiente de la tabla
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1); // Avanzamos a la siguiente página
  };

  // Función para cambiar a la página anterior de la tabla
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Retrocedemos a la página anterior si no estamos en la primera
    }
  };

  // Filtramos las opiniones según la página actual
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}> {/* Contenedor principal de la página */}
      <h1 className={styles.title}>Reportes</h1> {/* Título de la página */}

      {/* Sección de totales */}
      <div className={styles.totalsWrapper}> {/* Agrupamos los totales en dos filas */}
        <div className={styles.totalsContainer}> {/* Primera fila de totales */}
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input
              type="text"
              value={totals.totalQuejas}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input
              type="text"
              value={totals.totalSugerencias}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input
              type="text"
              value={totals.totalQuejasCerradas}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
        </div>
        <div className={styles.totalsContainer}> {/* Segunda fila de totales */}
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input
              type="text"
              value={totals.totalSugerenciasAbiertas}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input
              type="text"
              value={totals.totalQuejasAbiertas}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input
              type="text"
              value={totals.totalSugerenciasCerradas}
              readOnly
              className={styles.inputBlackText} // Texto de los números en negro
            />
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className={styles.chartsContainer}> {/* Contenedor para los gráficos */}
        <div className={styles.chart}>
          {/* Gráfico de quejas */}
          <iframe
            src="URL_DEL_GRAFICO_LOOKER_QUEJAS" // URL del gráfico de quejas desde Looker Studio
            title="Gráfico de Quejas"
            width="400"
            height="400"
            allowFullScreen
          ></iframe>
        </div>
        <div className={styles.chart}>
          {/* Gráfico de sugerencias */}
          <iframe
            src="URL_DEL_GRAFICO_LOOKER_SUGERENCIAS" // URL del gráfico de sugerencias desde Looker Studio
            title="Gráfico de Sugerencias"
            width="400"
            height="400"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Tabla de detalles */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th> {/* Columna de número */}
            <th>Tipo</th> {/* Columna de tipo (queja o sugerencia) */}
            <th>Descripción</th> {/* Columna de descripción */}
            <th>Nombre</th> {/* Columna de nombre */}
            <th>Estado</th> {/* Columna de estado */}
            <th>Fecha</th> {/* Columna de fecha */}
          </tr>
        </thead>
        <tbody>
          {/* Si no hay opiniones, mostramos filas vacías para llenar 10 líneas */}
          {paginatedOpinions.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={6}>&nbsp;</td> {/* colSpan es un número, corregido a colSpan={6} */}
                </tr>
              ))
            : paginatedOpinions.map((opinion, index) => (
                <tr key={opinion.id}> {/* Corregido con la clave única `opinion.id` */}
                  <td>{index + 1}</td> {/* Número de la opinión */}
                  <td>{opinion.tipo}</td> {/* Tipo de opinión */}
                  <td>{opinion.descripcion}</td> {/* Descripción */}
                  <td>{opinion.nombre}</td> {/* Nombre */}
                  <td>{opinion.estado}</td> {/* Estado */}
                  <td>{opinion.fecha}</td> {/* Fecha */}
                </tr>
              ))}
        </tbody>
      </table>

      {/* Botones de navegación entre páginas */}
      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button onClick={handlePrevPage} className={styles.button}>Anterior</button>
        )}
        {opinions.length > currentPage * opinionsPerPage && (
          <button onClick={handleNextPage} className={styles.button}>Siguiente</button>
        )}
      </div>

      {/* Botones de navegación */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleLogout}>Salir</button> {/* Botón de salir */}
        <button className={styles.button} onClick={handleMenu}>Menú</button> {/* Botón de menú */}
      </div>
    </main>
  );
}
