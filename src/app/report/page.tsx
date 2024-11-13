// Archivo: page.tsx
"use client";
import styles from "./report.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  tipo: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Función para obtener datos actualizados sin caché
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/report", {
        cache: "no-store", // Asegura que no se use caché y se obtenga siempre la información actual
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json();
      setTotals(data.totals);
      setOpinions(data.opinions);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Ocurrió un error al cargar los datos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la función de carga de datos al montar el componente o cambiar la página
  }, [currentPage]);

  // Refrescar datos manualmente
  const handleRefresh = () => {
    setCurrentPage(1);
    fetchData();
  };

  // Confirmación de cierre de sesión
  const handleLogout = () => {
    if (confirm("¿Está seguro de que desea salir?")) {
      alert("Gracias por utilizar el sistema");
      router.push("/login");
    }
  };

  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      <div className={styles.totalsWrapper}>
        <div className={styles.totalItem}>Total de Quejas: {totals?.totalQuejas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias: {totals?.totalSugerencias || 0}</div>
        <div className={styles.totalItem}>Total de Quejas Cerradas: {totals?.totalQuejasCerradas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals?.totalSugerenciasCerradas || 0}</div>
        <div className={styles.totalItem}>Total de Quejas Abiertas: {totals?.totalQuejasAbiertas || 0}</div>
        <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals?.totalSugerenciasAbiertas || 0}</div>
      </div>

      <div className={styles.chartsContainer}>
        {/* Iframes de Looker Studio */}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.reportTable}>
          <thead>
            <tr>
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
            {paginatedOpinions.map((opinion) => (
              <tr key={opinion.id}>
                <td>{opinion.tipo === 1 ? "Queja" : "Sugerencia"}</td>
                <td>{opinion.descripcion}</td>
                <td>{opinion.nombre}</td>
                <td>{opinion.apellido}</td>
                <td>{opinion.cedula}</td>
                <td>{new Date(opinion.fecha).toLocaleDateString("es-ES")}</td>
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

      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar Datos</button>
        <button onClick={handleLogout} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
