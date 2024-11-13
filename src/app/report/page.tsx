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

export default function Reportes() {
  const router = useRouter(); // Hook para manejar redirecciones
  const [opinions, setOpinions] = useState<OpinionData[]>([]); // Estado para almacenar las opiniones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const itemsPerPage = 10; // Número de opiniones por página

  // Función para obtener los datos del reporte desde la API sin usar caché
  const fetchReportData = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const response = await fetch("/api/report", { cache: "no-store" });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setOpinions(data.opinions); // Almacena las opiniones en el estado
      setLoading(false); // Desactiva el estado de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setLoading(false);
    }
  };

  // Hook useEffect para obtener los datos cuando el componente se monta
  useEffect(() => {
    fetchReportData(); // Llama a la función para cargar los datos al inicio
  }, []);

  // Función para refrescar los datos manualmente
  const handleRefresh = () => {
    setOpinions([]); // Limpia los datos de opiniones antes de actualizar
    fetchReportData(); // Vuelve a llamar a la función para obtener datos frescos
  };

  // Función para navegar al menú principal
  const handleMenu = () => {
    router.push("/menu");
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    if (confirm("¿Está seguro de que desea salir?")) {
      alert("Gracias por utilizar el sistema");
      router.push("/login");
    }
  };

  // Calcula las opiniones que se deben mostrar en la página actual
  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funciones de paginación
  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  // Muestra un mensaje de "Cargando datos..." si el estado de carga está activo
  if (loading) {
    return (
      <main className={styles.main}>
        <p className={styles.loadingText}>Cargando datos...</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

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

      {/* Botones de acción */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleLogout} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
