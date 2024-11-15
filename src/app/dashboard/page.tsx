// Archivo: src/app/dashboard/page.tsx
"use client";
import styles from "./dashboard.module.css"; // Importa los estilos CSS específicos para el módulo de dashboard
import React, { useState, useEffect } from "react"; // Importa React y sus hooks necesarios
import { useRouter } from "next/navigation"; // Importa el hook para manejar la navegación

// Definición de la estructura de cada opinión
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string; // "Queja" o "Sugerencia"
  description: string;
  comment: string; // Último comentario
  estado: string; // "Abierto" o "Cerrado"
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string;
}

export default function Dashboard() {
  const router = useRouter(); // Hook para manejar redirecciones
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones
  const [totals, setTotals] = useState({
    totalQuejas: 0,
    totalQuejasAbiertas: 0,
    totalQuejasCerradas: 0,
    totalSugerencias: 0,
    totalSugerenciasAbiertas: 0,
    totalSugerenciasCerradas: 0,
  }); // Estado para almacenar los totales
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función para obtener y procesar los datos de la API de gestión de opiniones
  const fetchReportData = async () => {
    setLoading(true); // Activa el indicador de carga
    console.log("Iniciando solicitud a la API de gestión de opiniones"); // Log de inicio de solicitud

    try {
      // Realiza una solicitud GET a la API de gestión de opiniones
      const response = await fetch(`/api/manageopinion?timestamp=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json(); // Convierte la respuesta en JSON
      console.log("Opiniones recibidas en el frontend:", data.opinions); // Log para verificar las opiniones recibidas

      // Filtra las opiniones para mantener solo el último comentario de cada opinión
      const uniqueOpinions = data.opinions.reduce((acc: Opinion[], opinion: Opinion) => {
        const existingIndex = acc.findIndex((o) => o.opinion_ID === opinion.opinion_ID);
        if (existingIndex === -1) {
          acc.push(opinion);
        } else {
          acc[existingIndex] = opinion; // Reemplaza la opinión existente con la más reciente
        }
        return acc;
      }, []);

      // Calcula los totales en el frontend
      const totalsCalculated = {
        totalQuejas: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 1).length,
        totalQuejasAbiertas: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 1 && opinion.estado === "Abierto").length,
        totalQuejasCerradas: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 1 && opinion.estado === "Cerrado").length,
        totalSugerencias: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 2).length,
        totalSugerenciasAbiertas: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 2 && opinion.estado === "Abierto").length,
        totalSugerenciasCerradas: uniqueOpinions.filter((opinion) => opinion.opinion_TypeID === 2 && opinion.estado === "Cerrado").length,
      };

      setOpinions(uniqueOpinions); // Actualiza las opiniones en el estado
      setTotals(totalsCalculated); // Actualiza los totales en el estado
      console.log("Totales calculados en el frontend:", totalsCalculated); // Log para verificar los totales calculados
      setLoading(false); // Desactiva el indicador de carga
    } catch (error) {
      console.error("Error al cargar los datos:", error); // Log de error
      setLoading(false); // Desactiva el indicador de carga en caso de error
    }
  };

  // Cargar los datos automáticamente al montar el componente
  useEffect(() => {
    fetchReportData(); // Llama a la función para cargar los datos al inicio
  }, []);

  // Función para actualizar los datos manualmente
  const handleRefresh = () => {
    fetchReportData(); // Vuelve a cargar los datos desde la API
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Muestra mensaje de "Cargando datos..." mientras los datos se están cargando */}
      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {/* Sección de Totales y Gráficos, solo se muestra cuando los datos están cargados */}
      {!loading && (
        <>
          {/* Sección de Totales */}
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>Total de Quejas: {totals.totalQuejas}</div>
            <div className={styles.totalItem}>Total de Sugerencias: {totals.totalSugerencias}</div>
            <div className={styles.totalItem}>Total de Quejas Abiertas: {totals.totalQuejasAbiertas}</div>
            <div className={styles.totalItem}>Total de Quejas Cerradas: {totals.totalQuejasCerradas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Abiertas: {totals.totalSugerenciasAbiertas}</div>
            <div className={styles.totalItem}>Total de Sugerencias Cerradas: {totals.totalSugerenciasCerradas}</div>
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
                    <td>{opinion.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Botones de acción para actualizar, ir al menú y salir */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar</button>
        <button onClick={() => router.push("/menu")} className={styles.pageButton}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
