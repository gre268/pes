"use client"; // Este código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos específicos de Reportes
import React, { useEffect, useState } from "react"; // Importamos React y hooks necesarios
import { useRouter } from "next/navigation"; // Importamos useRouter para redirección en Next.js

// Definimos la estructura de los datos para los totales y las opiniones
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
  const router = useRouter(); // Router para redirección
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales de las opiniones
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones paginadas
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de opiniones
  const opinionsPerPage = 10; // Número de opiniones a mostrar por página

  // useEffect para cargar los datos iniciales de totales y opiniones desde la API
  useEffect(() => {
    fetchTotals(); // Llamada para obtener totales
    fetchOpinions(); // Llamada para obtener opiniones
  }, []);

  // Función para obtener los totales de opiniones desde la API
  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) throw new Error("Error al obtener los totales");
      const data = await response.json();
      setTotals(data); // Almacenamos los datos de totales
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
      setOpinions(data.opinions); // Almacenamos las opiniones
    } catch (error) {
      console.error("Error al cargar las opiniones:", error);
    }
  };

  // Función para cambiar a la página siguiente de la tabla de opiniones
  const handleNextPage = () => {
    if (currentPage * opinionsPerPage < opinions.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Función para cambiar a la página anterior de la tabla de opiniones
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Opiniones a mostrar en la página actual
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de Totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input type="text" readOnly value={totals?.totalQuejas || 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input type="text" readOnly value={totals?.totalQuejasCerradas || 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input type="text" readOnly value={totals?.totalQuejasAbiertas || 0} className={styles.inputBlackText} />
          </div>
        </div>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input type="text" readOnly value={totals?.totalSugerencias || 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input type="text" readOnly value={totals?.totalSugerenciasAbiertas || 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input type="text" readOnly value={totals?.totalSugerenciasCerradas || 0} className={styles.inputBlackText} />
          </div>
        </div>
      </div>

      {/* Gráficos de Opiniones */}
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
                <td>{new Date(opinion.fecha_registro).toLocaleDateString()}</td>
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
        <button onClick={() => {
          if (window.confirm("¿Estás seguro de que deseas salir?")) {
            router.push("/login");
          }
        }} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
