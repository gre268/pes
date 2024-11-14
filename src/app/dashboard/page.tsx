// Archivo: src/app/dashboard/page.tsx
"use client";
import styles from "./dashboard.module.css"; 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Opinion {
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
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del reporte desde la API sin caché
  const fetchReportData = async () => {
    setLoading(true);
    setOpinions([]); // Limpia el estado de opiniones antes de cada carga
    setTotals(null);  // Limpia el estado de totales antes de cada carga
    try {
      // Agrega un parámetro único a la URL para evitar el caché
      const response = await fetch(`/api/dashboard?timestamp=${new Date().getTime()}`, {
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

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchReportData();
  }, []);

  // Función para refrescar los datos al hacer clic en "Actualizar"
  const handleRefresh = () => {
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

          {/* Tabla de opiniones */}
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
                {opinions.map((opinion, index) => (
                  <tr key={opinion.id}>
                    <td>{index + 1}</td>
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
