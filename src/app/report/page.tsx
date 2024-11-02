"use client"; // Indicamos que el código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos
import React, { useState, useEffect } from "react"; // Importamos React y los hooks
import { useRouter } from "next/navigation"; // Importamos useRouter para redirección

// Definimos interfaces para los datos
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
  opinion_TypeID: number;
  description: string;
  comment: string;
  status: string;
  name: string;
  lastName1: string;
  cedula: string;
  created_At: string;
}

export default function Reporte() {
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para las opiniones
  const [currentPage, setCurrentPage] = useState(1); // Estado de la página actual
  const opinionsPerPage = 10; // Número de opiniones por página
  const router = useRouter(); // Instancia de router para redirección

  // Cargar totales y opiniones al cargar el componente
  useEffect(() => {
    fetchTotals();
    fetchOpinions();
  }, []);

  // Función para obtener los totales
  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) throw new Error("Error al obtener los totales");
      const data = await response.json();
      setTotals(data); // Guardamos los totales en el estado
    } catch (error) {
      console.error("Error al cargar los totales:", error);
    }
  };

  // Función para obtener las opiniones
  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/manageopinion"); // Ruta para obtener las opiniones
      if (!response.ok) throw new Error("Error al obtener las opiniones");
      const data = await response.json();
      setOpinions(data.opinions); // Guardamos las opiniones en el estado
    } catch (error) {
      console.error("Error al cargar las opiniones:", error);
    }
  };

  // Cambiar a la siguiente página
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Cambiar a la página anterior
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Opiniones para mostrar en la página actual
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Totales agrupados en columnas */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasCerradas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasAbiertas : 0} className={styles.inputBlackText} />
          </div>
        </div>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input type="text" readOnly value={totals ? totals.totalSugerencias : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasAbiertas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasCerradas : 0} className={styles.inputBlackText} />
          </div>
        </div>
      </div>

      {/* Gráficos desde Looker Studio */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="250"
            height="250"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
            width="250"
            height="250"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
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
                <td>{opinion.opinion_TypeID === 1 ? "Queja" : "Sugerencia"}</td>
                <td>{opinion.description}</td>
                <td>{opinion.name}</td>
                <td>{opinion.lastName1}</td>
                <td>{opinion.cedula}</td>
                <td>{new Date(opinion.created_At).toLocaleDateString()}</td>
                <td>{opinion.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación de Opiniones */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
      </div>

      {/* Botones de Navegación */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
