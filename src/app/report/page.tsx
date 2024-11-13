// Archivo: page.tsx
"use client"; // Indica que este archivo se ejecuta en el lado del cliente.

import styles from "./report.module.css"; // Importa los estilos específicos del módulo de reportes.
import React, { useEffect, useState } from "react"; // Importa React y hooks para manejar el estado y efectos.
import { useRouter } from "next/navigation"; // Importa `useRouter` para manejar la navegación.

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
  tipo: number; // Tipo de la opinión (1 = Queja, 2 = Sugerencia).
  descripcion: string; // Descripción de la opinión.
  nombre: string; // Nombre del usuario.
  apellido: string; // Apellido del usuario.
  cedula: string; // Cédula del usuario.
  estado: string; // Estado de la opinión (Abierto o Cerrado).
  fecha: string; // Fecha de registro de la opinión.
}

// Componente principal de la página de reportes
export default function Reportes() {
  const router = useRouter(); // Hook para manejar la navegación.
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales.
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para las opiniones.
  const [loading, setLoading] = useState(true); // Estado de carga mientras se obtienen los datos.
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores.
  const [currentPage, setCurrentPage] = useState(1); // Estado de la página actual para la paginación.
  const opinionsPerPage = 10; // Número de opiniones a mostrar por página.

  // Hook para cargar los datos al montar el componente
  useEffect(() => {
    fetchData(); // Llama a la función para obtener datos desde la API.
  }, []);

  // Función para obtener los datos del reporte desde la API
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga mientras se obtienen los datos.
    try {
      // Llama a la API para obtener los datos actuales de la base de datos
      const response = await fetch("/api/report", {
        cache: "no-store", // Asegura que siempre obtenga datos actualizados, sin caché.
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json(); // Convierte la respuesta en JSON.
      if (data && typeof data === "object") {
        setTotals(data.totals); // Actualiza los totales con los datos obtenidos.
        setOpinions(data.opinions); // Actualiza las opiniones con los datos obtenidos.
      } else {
        throw new Error("Formato de datos del reporte incorrecto");
      }
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Ocurrió un error al cargar los datos. Intente nuevamente más tarde."); // Muestra mensaje de error.
    } finally {
      setLoading(false); // Desactiva el estado de carga.
    }
  };

  // Función para refrescar los datos al hacer clic en "Actualizar Datos"
  const handleRefresh = () => {
    fetchData(); // Llama a `fetchData()` para obtener los datos actualizados.
  };

  // Función para avanzar a la siguiente página de opiniones
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Función para retroceder a la página anterior de opiniones
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Paginación para opiniones en la página actual
  const paginatedOpinions = opinions.slice((currentPage - 1) * opinionsPerPage, currentPage * opinionsPerPage);

  // Muestra mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <main className={styles.main}>
        <h2 className={styles.loadingText}>Cargando datos...</h2>
      </main>
    );
  }

  // Muestra mensaje de error si ocurrió un problema al obtener los datos
  if (error) {
    return (
      <main className={styles.main}>
        <h2 className={styles.errorText}>{error}</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Quejas:</label>
          <label className={styles.value}>{totals?.totalQuejas || 0}</label>
        </div>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Sugerencias:</label>
          <label className={styles.value}>{totals?.totalSugerencias || 0}</label>
        </div>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Quejas Cerradas:</label>
          <label className={styles.value}>{totals?.totalQuejasCerradas || 0}</label>
        </div>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Sugerencias Cerradas:</label>
          <label className={styles.value}>{totals?.totalSugerenciasCerradas || 0}</label>
        </div>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Quejas Abiertas:</label>
          <label className={styles.value}>{totals?.totalQuejasAbiertas || 0}</label>
        </div>
        <div className={styles.totalItem}>
          <label className={styles.label}>Total de Sugerencias Abiertas:</label>
          <label className={styles.value}>{totals?.totalSugerenciasAbiertas || 0}</label>
        </div>
      </div>

      {/* Sección de gráficos con Looker Studio */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="100%" height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
            width="100%" height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </div>

      {/* Tabla de opiniones (con etiquetas `label`) */}
      <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
          <label className={styles.tableHeader}>Opinión</label>
          <label className={styles.tableHeader}>Descripción</label>
          <label className={styles.tableHeader}>Nombre</label>
          <label className={styles.tableHeader}>Apellido</label>
          <label className={styles.tableHeader}>Cédula</label>
          <label className={styles.tableHeader}>Fecha de Registro</label>
          <label className={styles.tableHeader}>Estado</label>
        </div>
        {paginatedOpinions.map((opinion) => (
          <div key={opinion.id} className={styles.tableRow}>
            <label className={styles.tableCell}>{opinion.tipo === 1 ? "Queja" : "Sugerencia"}</label>
            <label className={styles.tableCell}>{opinion.descripcion}</label>
            <label className={styles.tableCell}>{opinion.nombre}</label>
            <label className={styles.tableCell}>{opinion.apellido}</label>
            <label className={styles.tableCell}>{opinion.cedula}</label>
            <label className={styles.tableCell}>{new Date(opinion.fecha).toLocaleDateString('es-ES')}</label>
            <label className={styles.tableCell}>{opinion.estado}</label>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.button}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.button}>Siguiente</button>}
      </div>

      {/* Botones de Actualización */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.button}>Actualizar Datos</button>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
      </div>
    </main>
  );
}
