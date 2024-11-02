"use client"; // Este código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos del módulo
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definimos la estructura para los totales y las opiniones
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

interface Opinion {
  opinion_ID: number;
  opinion_type: string;
  description: string;
  name: string;
  lastName1: string;
  cedula: string;
  fecha_registro: string;
  estado: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para las opiniones
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const opinionsPerPage = 10; // Opiniones por página

  // useEffect para cargar los totales y opiniones al cargar el componente
  useEffect(() => {
    fetchTotalsAndOpinions();
  }, []);

  // Función para obtener totales y opiniones desde la API
  const fetchTotalsAndOpinions = async () => {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) throw new Error("Error al obtener los datos");
      const data = await response.json();
      setTotals(data.totals); // Guardamos los totales
      setOpinions(data.opinions); // Guardamos las opiniones
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Paginación
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Opiniones filtradas para la página actual
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  // Confirmación para el botón "Salir"
  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) router.push("/login");
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de Totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input type="text" readOnly value={totals?.totalQuejas ?? 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input type="text" readOnly value={totals?.totalQuejasCerradas ?? 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input type="text" readOnly value={totals?.totalQuejasAbiertas ?? 0} className={styles.inputBlackText} />
          </div>
        </div>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input type="text" readOnly value={totals?.totalSugerencias ?? 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input type="text" readOnly value={totals?.totalSugerenciasAbiertas ?? 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input type="text" readOnly value={totals?.totalSugerenciasCerradas ?? 0} className={styles.inputBlackText} />
          </div>
        </div>
      </div>

      {/* Gráficos de Looker Studio */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="250" height="250" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
        </div>
        <div className={styles.chart}>
          <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="250" height="250" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
        </div>
      </div>

      {/* Tabla de Opiniones */}
      <div className={styles.tableContainer}>
        <table className={styles.opinionTable}>
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
              <tr key={opinion.opinion_ID}>
                <td>{index + 1 + (currentPage - 1) * opinionsPerPage}</td>
                <td>{opinion.opinion_type}</td>
                <td>{opinion.description}</td>
                <td>{opinion.name}</td>
                <td>{opinion.lastName1}</td>
                <td>{opinion.cedula}</td>
                <td>{opinion.fecha_registro}</td>
                <td>{opinion.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.button}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.button}>Siguiente</button>}
      </div>

      {/* Botones de navegación */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={handleLogout} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
