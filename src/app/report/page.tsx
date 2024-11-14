// Archivo: page.tsx para el módulo de reportes
"use client";
import styles from "./report.module.css"; 
import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 

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
  const [loading, setLoading] = useState(true); 

  // Función para obtener los datos del reporte desde la API sin usar caché
  const fetchReportData = async () => {
    setLoading(true); 
    try {
      const response = await fetch("/api/report", { cache: "no-store" });
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

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchReportData(); 
  }, []);

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

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {!loading && totals && (
        <>
          {/* Sección de Totales */}
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>Total de Quejas: {totals.totalQuejas}</div>
            <div className={styles.totalItem}>Total de Sugerencias: {totals.totalSugerencias}</div>
            <div className={styles.totalItem}>Total de Quejas Cerradas: {totals.totalQuejasCerradas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals.totalSugerenciasCerradas}</div>
            <div className={styles.totalItem}>Total de Quejas Abiertas: {totals.totalQuejasAbiertas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals.totalSugerenciasAbiertas}</div>
          </div>

          {/* Gráficos de Looker Studio ajustados */}
          <div className={styles.chartsContainer}>
            <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
            <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
          </div>

          {/* Sección de Opiniones en Formato Label */}
          <div className={styles.opinionsWrapper}>
            {opinions.map((opinion, index) => (
              <div key={opinion.id} className={styles.opinionItem}>
                <label className={styles.label}><strong>#{index + 1}</strong></label>
                <label className={styles.label}>Opinión: {opinion.tipo}</label>
                <label className={styles.label}>Descripción: {opinion.descripcion}</label>
                <label className={styles.label}>Nombre: {opinion.nombre}</label>
                <label className={styles.label}>Apellido: {opinion.apellido}</label>
                <label className={styles.label}>Cédula: {opinion.cedula}</label>
                <label className={styles.label}>Fecha de Registro: {opinion.fecha}</label>
                <label className={styles.label}>Estado: {opinion.estado}</label>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Botones de acción */}
      <div className={styles.buttonContainer}>
        <button onClick={fetchReportData} className={styles.pageButton}>Actualizar</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
