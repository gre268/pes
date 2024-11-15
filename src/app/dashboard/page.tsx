// Archivo: src/app/dashboard/page.tsx
"use client"; // Indica que este archivo se ejecuta en el cliente (navegador)
import styles from "./dashboard.module.css"; // Importa los estilos CSS específicos para el módulo
import React, { useState, useEffect } from "react"; // Importa React y los hooks necesarios
import { useRouter } from "next/navigation"; // Hook para manejar la navegación en Next.js

// Definición de la estructura de cada opinión
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string; // "Queja" o "Sugerencia"
  description: string;
  estado: string; // "Abierto" o "Cerrado"
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string;
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
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para obtener los datos desde la API de gestión de opiniones
  const fetchReportData = async () => {
    setLoading(true); // Activa el indicador de carga
    setError(null); // Reinicia el estado de error antes de la carga
    console.log("Iniciando la solicitud a la API de gestión de opiniones"); // Mensaje de consola

    try {
      // Llama a la API de gestión de opiniones con un parámetro único para evitar caché
      const response = await fetch(`/api/manageopinion?timestamp=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el reporte: Respuesta no OK"); // Lanza un error si la respuesta no es OK
      }

      console.log("Respuesta recibida, convirtiendo a JSON"); // Mensaje de consola
      const data = await response.json(); // Convierte la respuesta en JSON
      console.log("Datos recibidos de la API:", data); // Muestra los datos recibidos en la consola

      setOpinions(data.opinions); // Almacena las opiniones en el estado
      setTotals(data.totals); // Almacena los totales en el estado
      setLoading(false); // Desactiva el indicador de carga
    } catch (err) {
      console.error("Error al cargar los datos:", err); // Muestra el error en la consola
      setError("Error al cargar los datos. Intente nuevamente."); // Establece un mensaje de error en la interfaz
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

  // Función para borrar datos y redirigir al login al salir
  const handleExit = () => {
    setOpinions([]); // Limpia las opiniones del estado
    setTotals(null); // Limpia los totales del estado
    router.push("/login"); // Redirige al usuario al login
  };

  // Función para borrar datos y redirigir al menú principal
  const handleMenu = () => {
    setOpinions([]); // Limpia las opiniones del estado
    setTotals(null); // Limpia los totales del estado
    router.push("/menu"); // Redirige al usuario al menú principal
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Muestra mensaje de error si hay algún problema */}
      {error && <p className={styles.errorText}>{error}</p>}

      {/* Muestra mensaje de "Cargando datos..." mientras los datos se están cargando */}
      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {/* Sección de Totales y Gráficos, solo se muestra cuando los datos están cargados */}
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
                  <tr key={opinion.opinion_ID}>
                    <td>{index + 1}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>{new Date(opinion.fecha_registro).toLocaleDateString('es-ES')}</td>
                    <td>{opinion.estado}</td>
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
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleExit} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
