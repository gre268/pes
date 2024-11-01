"use client"; // Este código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos del módulo
import React, { useEffect, useState } from "react"; // Importamos React y hooks
import { useRouter } from "next/navigation"; // Importamos useRouter para la navegación

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
  id: number;
  tipo: string;
  descripcion: string;
  nombre: string;
  estado: string;
  fecha: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const opinionsPerPage = 10; // Opiniones por página

  // useEffect para cargar los totales y las opiniones al cargar el componente
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
      setTotals(data); // Guardamos los totales en el estado
    } catch (error) {
      console.error("Error al cargar los totales:", error);
    }
  };

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/gestionOpinion");
      if (!response.ok) throw new Error("Error al obtener las opiniones");
      const data = await response.json();
      setOpinions(data); // Guardamos las opiniones en el estado
    } catch (error) {
      console.error("Error al cargar las opiniones:", error);
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
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de totales en dos grupos de 3 */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsContainer}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input type="text" readOnly value={totals ? totals.totalSugerencias : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasCerradas : 0} className={styles.inputBlackText} />
          </div>
        </div>
        <div className={styles.totalsContainer}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasAbiertas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasAbiertas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasCerradas : 0} className={styles.inputBlackText} />
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="400"
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
            width="400"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </div>

      {/* Listado de Opiniones con Paginación */}
      <div className={styles.opinionsList}>
        {paginatedOpinions.length > 0 ? (
          paginatedOpinions.map((opinion, index) => (
            <div key={opinion.id} className={styles.opinionItem}>
              <p><strong>#{(currentPage - 1) * opinionsPerPage + index + 1}</strong></p>
              <p><strong>Tipo:</strong> {opinion.tipo}</p>
              <p><strong>Descripción:</strong> {opinion.descripcion}</p>
              <p><strong>Nombre:</strong> {opinion.nombre}</p>
              <p><strong>Estado:</strong> {opinion.estado}</p>
              <p><strong>Fecha:</strong> {opinion.fecha}</p>
            </div>
          ))
        ) : (
          <p>No hay opiniones para mostrar.</p>
        )}
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.button}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.button}>Siguiente</button>}
      </div>

      {/* Botones de Salir y Menú */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
