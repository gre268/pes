// Archivo: page.tsx
"use client"; // Indica que este archivo se ejecuta en el cliente (frontend)
import styles from "./report.module.css"; // Importa los estilos CSS específicos para este módulo
import React, { useState, useEffect } from "react"; // Importa React y sus hooks
import { useRouter } from "next/navigation"; // Para manejar la navegación entre páginas

// Define la estructura de los totales
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

// Define la estructura de cada opinión
interface Opinion {
  id: number;
  tipo: number; // Tipo de la opinión (1 = Queja, 2 = Sugerencia)
  descripcion: string; // Descripción de la opinión
  nombre: string; // Nombre del usuario
  apellido: string; // Apellido del usuario
  cedula: string; // Cédula del usuario
  estado: string; // Estado de la opinión (Abierto o Cerrado)
  fecha: string; // Fecha de registro de la opinión
}

export default function Reportes() {
  const router = useRouter(); // Hook para manejar redirecciones
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para las opiniones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [currentPage, setCurrentPage] = useState(1); // Estado de la página actual
  const itemsPerPage = 10; // Número de opiniones por página

  // Función para obtener los datos del reporte desde la API, sin usar caché
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const response = await fetch("/api/report", {
        cache: "no-store", // No cachea la respuesta, siempre obtiene datos actualizados
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setTotals(data.totals); // Actualiza los totales
      setOpinions(data.opinions); // Actualiza las opiniones
      setLoading(false); // Desactiva el estado de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Ocurrió un error al cargar los datos.");
      setLoading(false);
    }
  };

  // Cargar los datos cuando se monte el componente o se actualice
  useEffect(() => {
    fetchData();
  }, []);

  // Función para refrescar los datos manualmente
  const handleRefresh = () => {
    setCurrentPage(1); // Resetea a la primera página
    fetchData(); // Llama a la función de carga de datos
  };

  // Función para confirmar y realizar el cierre de sesión
  const handleLogout = () => {
    if (confirm("¿Está seguro de que desea salir?")) {
      alert("Gracias por utilizar el sistema");
      router.push("/login");
    }
  };

  // Función para redirigir al menú principal
  const handleMenu = () => {
    router.push("/menu");
  };

  // Muestra los datos de la página actual
  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funciones de paginación
  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  if (loading) {
    return (
      <main className={styles.main}>
        <h2 className={styles.loadingText}>Cargando datos...</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de Totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalItem}>Total de Quejas: {totals?.totalQuejas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias: {totals?.totalSugerencias || 0}</div>
        <div className={styles.totalItem}>Total de Quejas Cerradas: {totals?.totalQuejasCerradas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals?.totalSugerenciasCerradas || 0}</div>
        <div className={styles.totalItem}>Total de Quejas Abiertas: {totals?.totalQuejasAbiertas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals?.totalSugerenciasAbiertas || 0}</div>
      </div>

      {/* Botón para actualizar datos de totales y tabla */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar Totales y Tabla</button>
      </div>

      {/* Gráficos de Looker Studio */}
      <div className={styles.chartsContainer}>
        <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="400" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
        <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="400" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
      </div>

      {/* Tabla de opiniones */}
      <div className={styles.tableContainer}>
        <table className={styles.reportTable}>
          <thead>
            <tr>
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
            {paginatedOpinions.map((opinion) => (
              <tr key={opinion.id}>
                <td>{opinion.tipo === 1 ? "Queja" : "Sugerencia"}</td>
                <td>{opinion.descripcion}</td>
                <td>{opinion.nombre}</td>
                <td>{opinion.apellido}</td>
                <td>{opinion.cedula}</td>
                <td>{new Date(opinion.fecha).toLocaleDateString("es-ES")}</td>
                <td>{opinion.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
        {opinions.length > currentPage * itemsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
      </div>

      {/* Botones de acción */}
      <div className={styles.buttonContainer}>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleLogout} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
