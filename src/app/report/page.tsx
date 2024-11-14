// Archivo: page.tsx para el módulo de reportes
"use client";
import styles from "./report.module.css"; 
import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 

interface OpinionData {
  id: number;
  tipo_texto: string;
  estado: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

export default function Reportes() {
  const router = useRouter(); 
  const [opinions, setOpinions] = useState<OpinionData[]>([]); 
  const [totals, setTotals] = useState<Totals | null>(null); 
  const [loading, setLoading] = useState(false); 
  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(1); 

  const fetchReportData = async () => {
    setLoading(true); 
    setOpinions([]); 
    setTotals(null); 

    try {
      const response = await fetch("/api/report", {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setOpinions(data.opinions); 
      setTotals(data.totals); 
      setLoading(false); 
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(); 
  }, []);

  const handleRefresh = () => {
    setOpinions([]); 
    setTotals(null); 
    fetchReportData(); 
  };

  const handleExit = () => {
    setOpinions([]); 
    setTotals(null); 
    router.push("/login"); 
  };

  const handleMenu = () => {
    setOpinions([]); 
    setTotals(null); 
    router.push("/menu");
  };

  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {!loading && totals && (
        <>
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>Total de Quejas: {totals.totalQuejas}</div>
            <div className={styles.totalItem}>Total de Sugerencias: {totals.totalSugerencias}</div>
            <div className={styles.totalItem}>Total de Quejas Cerradas: {totals.totalQuejasCerradas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals.totalSugerenciasCerradas}</div>
            <div className={styles.totalItem}>Total de Quejas Abiertas: {totals.totalQuejasAbiertas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals.totalSugerenciasAbiertas}</div>
          </div>

          <div className={styles.chartsContainer}>
            <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
            <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
          </div>

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
                    <td>{opinion.tipo_texto}</td>
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

          <div className={styles.pagination}>
            {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
            {opinions.length > currentPage * itemsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
          </div>
        </>
      )}

      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
