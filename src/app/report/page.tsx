"use client"; // Este código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos específicos para este módulo
import React, { useEffect, useState } from "react"; // Importamos React y hooks
import { useRouter } from "next/navigation"; // Importamos useRouter para la navegación

// Definimos la estructura para los totales y las opiniones, incluyendo los campos faltantes 'apellido' y 'cedula'
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
  tipo: string;
  descripcion: string;
  nombre: string;
  apellido: string; // Campo adicional
  cedula: string;   // Campo adicional
  estado: string;
  fecha: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones, inicia como array vacío
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error para manejar problemas de carga
  const opinionsPerPage = 10; // Número de opiniones por página

  // useEffect para cargar los totales y las opiniones cuando se carga el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Activamos el estado de carga
      try {
        await fetchTotals(); // Cargar totales
        await fetchOpinions(); // Cargar opiniones
      } catch (err) {
        console.error("Error al cargar los datos:", err); // Log del error
        setError("Ocurrió un error al cargar los datos. Intente nuevamente más tarde."); // Mensaje de error
      } finally {
        setLoading(false); // Desactivamos el estado de carga
      }
    };
    fetchData();
  }, []);

  // Función para obtener los totales desde la API
  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/reportTotals"); // Solicitamos los totales a la API
      if (!response.ok) throw new Error("Error al obtener los totales"); // Verificamos si la respuesta fue exitosa
      const data = await response.json(); // Parseamos los datos de la respuesta
      if (data && typeof data === 'object') {
        setTotals(data); // Guardamos los totales en el estado
      } else {
        throw new Error("Formato de datos de los totales incorrecto");
      }
    } catch (error) {
      throw error; // Enviamos el error para ser manejado
    }
  };

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/reportOpinions"); // Solicitamos las opiniones a la API
      if (!response.ok) throw new Error("Error al obtener las opiniones"); // Verificamos si la respuesta fue exitosa
      const data = await response.json(); // Parseamos los datos de la respuesta
      console.log("Opinions data fetched:", data); // Agregamos un log para verificar la estructura de datos
      if (Array.isArray(data)) {
        setOpinions(data); // Guardamos las opiniones en el estado solo si es un array
      } else {
        throw new Error("Las opiniones recibidas no son un array");
      }
    } catch (error) {
      throw error; // Enviamos el error para ser manejado
    }
  };

  // Cambiar a la siguiente página de opiniones
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Cambiar a la página anterior de opiniones
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Filtrar opiniones para mostrar en la página actual
  const paginatedOpinions = opinions.slice((currentPage - 1) * opinionsPerPage, currentPage * opinionsPerPage);

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

      {/* Sección de totales en el centro */}
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

      {/* Sección de gráficos con Looker Studio */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="600"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
            width="600"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </div>

      {/* Opiniones mostradas en una tabla */}
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
              <tr key={index}>
                <td>{index + 1 + (currentPage - 1) * opinionsPerPage}</td>
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
