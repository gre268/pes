"use client";  // Indicamos que el componente debe ser ejecutado en el cliente.

import styles from "./report.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Interfaces para definir la estructura de datos.
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

interface Opinion {
  id: number;
  tipo: number; // Cambiado a number para coincidir con el tipo esperado.
  descripcion: string;
  nombre: string;
  apellido: string;
  cedula: string;
  estado: string;
  fecha: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual.
  const opinionsPerPage = 10; // Número de opiniones por página.

  // useEffect para cargar los datos del reporte al montar el componente.
  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener los datos desde la API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/report", {
        cache: "no-store", // Asegura que no se cacheen los datos y se obtengan siempre actualizados.
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      if (data && typeof data === 'object') {
        setTotals(data.totals);
        setOpinions(Array.isArray(data.opinions) ? data.opinions : []);
      } else {
        throw new Error("Formato de datos del reporte incorrecto");
      }
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Ocurrió un error al cargar los datos. Intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la navegación a la página siguiente.
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Función para manejar la navegación a la página anterior.
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Filtrar opiniones para la página actual.
  const paginatedOpinions = opinions.slice((currentPage - 1) * opinionsPerPage, currentPage * opinionsPerPage);

  // Completar la tabla con filas vacías si hay menos de 10 opiniones en la página.
  const filledOpinions = [
    ...paginatedOpinions,
    ...Array.from({ length: opinionsPerPage - paginatedOpinions.length }, (_, index) => ({
      id: `empty-${index}`,
      tipo: 0,
      descripcion: "",
      nombre: "",
      apellido: "",
      cedula: "",
      estado: "",
      fecha: ""
    }))
  ];

  // Función para convertir el valor de tipo de opinión a un texto legible.
  const getTipoOpinion = (tipo: number) => {
    return tipo === 1 ? "Queja" : tipo === 2 ? "Sugerencia" : "";
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h2 className={styles.loadingText}>Cargando datos...</h2>
      </main>
    );
  }

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
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Quejas</p>
          <input type="text" readOnly value={totals?.totalQuejas || 0} className={styles.inputBlackText} />
        </div>
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Sugerencias</p>
          <input type="text" readOnly value={totals?.totalSugerencias || 0} className={styles.inputBlackText} />
        </div>
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Quejas Cerradas</p>
          <input type="text" readOnly value={totals?.totalQuejasCerradas || 0} className={styles.inputBlackText} />
        </div>
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Sugerencias Cerradas</p>
          <input type="text" readOnly value={totals?.totalSugerenciasCerradas || 0} className={styles.inputBlackText} />
        </div>
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Quejas Abiertas</p>
          <input type="text" readOnly value={totals?.totalQuejasAbiertas || 0} className={styles.inputBlackText} />
        </div>
        <div className={styles.totalsItem}>
          <p className={styles.label}>Total de Sugerencias Abiertas</p>
          <input type="text" readOnly value={totals?.totalSugerenciasAbiertas || 0} className={styles.inputBlackText} />
        </div>
      </div>

      {/* Sección de gráficos con Looker Studio */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="650" height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
            width="650" height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
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
            {filledOpinions.map((opinion, index) => (
              <tr key={opinion.id}>
                <td>{index + 1 + (currentPage - 1) * opinionsPerPage}</td>
                <td>{getTipoOpinion(opinion.tipo)}</td>
                <td>{opinion.descripcion}</td>
                <td>{opinion.nombre}</td>
                <td>{opinion.apellido}</td>
                <td>{opinion.cedula}</td>
                <td>{opinion.fecha ? new Date(opinion.fecha).toLocaleDateString('es-ES') : ""}</td>
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

      {/* Botones de Salir y Menú */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button
          onClick={() => {
            if (window.confirm("¿Está seguro de que quiere salir?")) {
              router.push("/login");
            }
          }}
          className={styles.button}
        >
          Salir
        </button>
      </div>
    </main>
  );
}
