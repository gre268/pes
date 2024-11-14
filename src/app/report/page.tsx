// Archivo: page.tsx para el módulo de reportes
"use client";
import styles from "./report.module.css"; // Importa los estilos CSS específicos para este módulo
import React, { useState, useEffect } from "react"; // Importa React y sus hooks
import { useRouter } from "next/navigation"; // Para manejar la navegación entre páginas

// Definimos la estructura de cada opinión con datos procesados en el backend
interface OpinionData {
  id: number;
  tipo: string;
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
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar si los datos han sido cargados
  const itemsPerPage = 10; // Número de opiniones por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación

  // Función para obtener los datos del reporte desde la API sin usar caché
  const fetchReportData = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      // Realiza la solicitud a la API sin caché
      const response = await fetch("/api/report", { cache: "no-store" });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setOpinions(data.opinions); // Almacena las opiniones en el estado
      setTotals(data.totals); // Almacena los totales en el estado
      setDataLoaded(true); // Marca que los datos han sido cargados
      setLoading(false); // Desactiva el estado de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setLoading(false);
    }
  };

  // Efecto para cargar y reconstruir la tabla cuando se refrescan los datos
  useEffect(() => {
    if (dataLoaded) {
      fetchReportData(); // Vuelve a cargar los datos al montar el componente
    }
    return () => {
      setOpinions([]); // Limpia los datos de opiniones al salir
      setTotals(null); // Limpia los totales al salir
      setDataLoaded(false); // Marca que los datos no están cargados
    };
  }, [dataLoaded]); // Se activa cuando `dataLoaded` cambia

  // Función para cargar los datos al hacer clic en el botón "Cargar Datos"
  const handleLoadData = () => {
    setDataLoaded(false); // Reinicia el estado de carga de datos
    fetchReportData(); // Llama a la función para cargar los datos
  };

  // Función para borrar los datos cuando el usuario sale del módulo
  const handleExit = () => {
    setOpinions([]); // Limpia los datos de opiniones al salir
    setTotals(null); // Limpia los totales al salir
    setDataLoaded(false); // Marca que los datos no están cargados
    router.push("/login"); // Redirige al usuario a la página de login
  };

  // Función para navegar al menú principal sin borrar los datos
  const handleMenu = () => {
    setOpinions([]); // Limpia los datos antes de ir al menú
    setTotals(null); // Limpia los totales
    setDataLoaded(false); // Marca que los datos no están cargados
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

      {/* Botón para cargar datos si aún no han sido cargados */}
      {!dataLoaded && (
        <button onClick={handleLoadData} className={styles.loadButton}>
          Cargar Datos
        </button>
      )}

      {/* Muestra mensaje de "Cargando datos..." si está cargando */}
      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {/* Muestra la tabla, los totales y el contenido solo si los datos están cargados */}
      {dataLoaded && !loading && (
        <>
          {/* Sección de Totales */}
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>Total de Quejas: {totals?.totalQuejas || 0}</div>
            <div className={styles.totalItem}>Total de Sugerencias: {totals?.totalSugerencias || 0}</div>
            <div className={styles.totalItem}>Total de Quejas Cerradas: {totals?.totalQuejasCerradas || 0}</div>
            <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals?.totalSugerenciasCerradas || 0}</div>
            <div className={styles.totalItem}>Total de Quejas Abiertas: {totals?.totalQuejasAbiertas || 0}</div>
            <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals?.totalSugerenciasAbiertas || 0}</div>
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
                    <td>{opinion.tipo}</td>
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
        <button onClick={handleLoadData} className={styles.pageButton}>Actualizar</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
