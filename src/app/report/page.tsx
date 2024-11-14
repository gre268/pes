// Archivo: page.tsx para el módulo de reportes
"use client";
import styles from "./report.module.css"; // Importa los estilos CSS específicos para este módulo
import React, { useState, useEffect } from "react"; // Importa React y sus hooks
import { useRouter } from "next/navigation"; // Para manejar la navegación entre páginas

// Definimos la estructura de cada opinión con datos procesados en el backend
interface OpinionData {
  id: number;
  tipo_texto: string;
  estado: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

// Definimos la estructura de los totales
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

export default function Reportes() {
  const router = useRouter(); // Hook para manejar redirecciones
  const [opinions, setOpinions] = useState<OpinionData[]>([]); // Estado para almacenar las opiniones
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales
  const [loading, setLoading] = useState(false); // Estado de carga
  const itemsPerPage = 10; // Número de opiniones por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación

  // Función para obtener los datos del reporte desde la vista en la base de datos
  const fetchReportData = async () => {
    setLoading(true); // Activa el estado de carga
    setOpinions([]); // Limpia el estado de opiniones antes de cargar nuevos datos
    setTotals(null); // Limpia los totales

    try {
      const response = await fetch("/api/report", {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setOpinions(data.opinions); // Almacena las opiniones en el estado
      setTotals(data.totals); // Almacena los totales en el estado
      setLoading(false); // Desactiva el estado de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setLoading(false);
    }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchReportData(); // Llama a la función para cargar los datos al inicio
  }, []);

  // Función para manejar el botón de "Actualizar"
  const handleRefresh = () => {
    setOpinions([]); // Limpia las opiniones actuales
    setTotals(null); // Limpia los totales actuales
    fetchReportData(); // Llama a la función para obtener los datos nuevos
  };

  // Función para borrar los datos cuando el usuario sale del módulo
  const handleExit = () => {
    setOpinions([]); // Limpia los datos de opiniones al salir
    setTotals(null); // Limpia los totales al salir
    router.push("/login"); // Redirige al usuario a la página de login
  };

  // Función para navegar al menú principal sin borrar los datos
  const handleMenu = () => {
    setOpinions([]); // Limpia los datos antes de ir al menú
    setTotals(null); // Limpia los totales
    router.push("/menu");
  };

  // Calcula las opiniones que se deben mostrar en la página actual
  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funciones de paginación
  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Muestra mensaje de "Cargando datos..." si está cargando */}
      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {/* Muestra los totales, gráficos y la tabla solo si los datos están cargados */}
      {!loading && totals && (
        <>
          {/* Sección de Totales */}
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>Total de Quejas: {totals.totalQuejas}</div>
            <div className={styles.totalItem}>Total de Sugerencias: {totals.totalSugerencias}</div>
            <div className={styles.totalItem}>Total de Quejas Cerradas: {totals.totalQuejasCerradas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals.totalSugerenciasCerradas}</div>
            <div className={styles.totalItem}>Total de Quejas Abiertas: {totals.totalQuejasAbiertas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals.totalSugerenciasAbiertas}</div>
          </div>

          {/* Gráficos de Looker Studio ajustados */}
          <div className={styles.chartsContainer}>
            <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
            <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
          </div>

          {/* Tabla de opiniones */}
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Opinión</th>
                  <th>Descripción</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Fecha de Registro</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOpinions.map((opinion, index) => (
                  <tr key={opinion.id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{opinion.tipo_texto}</td>
                    <td>{opinion.descripcion}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>{opinion.fecha}</td>
                    <td>{opinion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className={styles.pagination}>
            {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
            {opinions.length > currentPage * itemsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
          </div>
        </>
      )}

      {/* Botones de acción */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
