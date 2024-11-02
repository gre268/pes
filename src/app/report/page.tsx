"use client"; // Código ejecutado en el cliente
import styles from "./report.module.css"; // Importamos los estilos del módulo
import React, { useEffect, useState } from "react"; // Importamos React y hooks
import { useRouter } from "next/navigation"; // Importamos useRouter para navegación

// Estructuras para totales y opiniones
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
  created_At: string;
  status: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para opiniones
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const opinionsPerPage = 10; // Opiniones por página

  // useEffect para cargar totales y opiniones al cargar el componente
  useEffect(() => {
    fetchTotals();
    fetchOpinions();
  }, []);

  // Función para obtener los totales desde la API
  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) throw new Error("Error al obtener los totales");
      const data = await response.json();
      setTotals(data);
    } catch (error) {
      console.error("Error al cargar los totales:", error);
    }
  };

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/manageopinion");
      if (!response.ok) throw new Error("Error al obtener las opiniones");
      const data = await response.json();
      setOpinions(data.opinions);
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
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  // Confirmación antes de salir
  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas salir?");
    if (confirmLogout) router.push("/login");
  };

  // Opiniones para la página actual
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Totales en dos columnas */}
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

      {/* Gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="250"
            height="250"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
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
          ></iframe>
        </div>
      </div>

      {/* Tabla de opiniones */}
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
            {paginatedOpinions.length > 0 ? (
              paginatedOpinions.map((opinion, index) => (
                <tr key={opinion.opinion_ID}>
                  <td>{index + 1 + (currentPage - 1) * opinionsPerPage}</td>
                  <td>{opinion.opinion_type}</td>
                  <td>{opinion.description}</td>
                  <td>{opinion.name}</td>
                  <td>{opinion.lastName1}</td>
                  <td>{opinion.cedula}</td>
                  <td>{new Date(opinion.created_At).toLocaleDateString()}</td>
                  <td>{opinion.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No hay opiniones para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
      </div>

      {/* Botones de navegación */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={handleLogout} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
