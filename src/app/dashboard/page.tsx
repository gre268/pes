// Archivo: src/app/dashboard/page.tsx
"use client"; // Este archivo se ejecuta en el cliente (navegador)
import styles from "./dashboard.module.css"; // Archivo de estilos CSS específico para el módulo
import React, { useState } from "react"; // Importa React y sus hooks necesarios
import { useRouter } from "next/navigation"; // Hook para manejar la navegación en Next.js

// Definición de la estructura de cada opinión
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

// Definición de la estructura de los totales
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

export default function Reportes() {
  const router = useRouter(); // Hook para manejar redirecciones
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales
  const [loading, setLoading] = useState(false); // Estado de carga
  const [dataLoaded, setDataLoaded] = useState(false); // Controla si los datos han sido cargados

  // Función para cargar los datos de la API y reconstruir la tabla y los totales
  const loadReportData = async () => {
    setLoading(true); // Activa el indicador de carga
    setOpinions([]); // Limpia las opiniones anteriores
    setTotals(null); // Limpia los totales anteriores
    try {
      const response = await fetch(`/api/dashboard?timestamp=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json(); // Convierte la respuesta en JSON
      setOpinions(data.opinions); // Almacena las opiniones en el estado
      setTotals(data.totals); // Almacena los totales en el estado
      setDataLoaded(true); // Marca que los datos han sido cargados
      setLoading(false); // Desactiva el indicador de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err); // Muestra el error en la consola
      setLoading(false); // Desactiva el indicador de carga en caso de error
    }
  };

  // Función para borrar datos y redirigir al login al salir
  const handleExit = () => {
    setOpinions([]); // Limpia las opiniones del estado
    setTotals(null); // Limpia los totales del estado
    setDataLoaded(false); // Restablece el estado de datos cargados
    router.push("/login"); // Redirige al usuario al login
  };

  // Función para borrar datos y redirigir al menú principal
  const handleMenu = () => {
    setOpinions([]); // Limpia las opiniones del estado
    setTotals(null); // Limpia los totales del estado
    setDataLoaded(false); // Restablece el estado de datos cargados
    router.push("/menu"); // Redirige al usuario al menú principal
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Botón para cargar datos si aún no han sido cargados */}
      {!dataLoaded && (
        <button onClick={loadReportData} className={styles.pageButton}>
          Cargar Datos
        </button>
      )}

      {/* Muestra mensaje de "Cargando datos..." mientras los datos se están cargando */}
      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {/* Sección de Totales y Gráficos, solo se muestra cuando los datos están cargados */}
      {dataLoaded && !loading && totals && (
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

          {/* Gráficos de Looker Studio */}
          <div className={styles.chartsContainer}>
            <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
            <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="380" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
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
                {/* Muestra cada opinión en una fila de la tabla */}
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

      {/* Botones de acción para ir al menú y salir */}
      <div className={styles.buttonContainer}>
        <button onClick={loadReportData} className={styles.pageButton}>Cargar Datos</button>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
