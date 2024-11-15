"use client";
import styles from "./dashboard.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Opinion {
  opinion_ID: number;
  opinion_type: string;
  description: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string;
  comentario: string;
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
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    setLoading(true);
    console.log("Iniciando solicitud de datos en el frontend"); 

    try {
      const response = await fetch(`/api/dashboard?timestamp=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      console.log("Opiniones recibidas en el frontend:", data.opinions); // Verifica las opiniones recibidas en el frontend
      console.log("Totales recibidos en el frontend:", data.totals); // Verifica los totales recibidos en el frontend

      setOpinions(data.opinions);
      setTotals(data.totals);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos en el frontend:", err); // Log del error en el frontend
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleRefresh = () => {
    fetchReportData();
  };

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
                  <th>Último Comentario</th>
                </tr>
              </thead>
              <tbody>
                {opinions.map((opinion, index) => (
                  <tr key={opinion.opinion_ID}>
                    <td>{index + 1}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>{new Date(opinion.fecha_registro).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td>{opinion.estado}</td>
                    <td>{opinion.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar</button>
        <button onClick={() => router.push("/menu")} className={styles.pageButton}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
