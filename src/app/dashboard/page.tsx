"use client"; // Indica que este archivo se ejecuta en el cliente (navegador)
import styles from "./dashboard.module.css"; // Importa los estilos CSS específicos para el módulo de dashboard
import React, { useState, useEffect } from "react"; // Importa React y sus hooks necesarios
import { useRouter } from "next/navigation"; // Importa el hook para manejar redirecciones entre páginas

// Define la estructura de cada opinión, especificando el tipo de cada propiedad
interface Opinion {
  opinion_ID: number; // ID único de la opinión
  opinion_TypeID: number; // Tipo de opinión (1 = Queja, 2 = Sugerencia)
  opinion_type: string; // Tipo en texto ("Queja" o "Sugerencia")
  description: string; // Descripción de la opinión
  comment: string; // Último comentario de la opinión
  estado: string; // Estado de la opinión ("Abierto" o "Cerrado")
  nombre: string; // Nombre del usuario que hizo la opinión
  apellido: string; // Apellido del usuario
  cedula: string; // Cédula del usuario
  fecha_registro: string; // Fecha de registro de la opinión
}

// Componente principal del módulo de dashboard
export default function Dashboard() {
  const router = useRouter(); // Hook para manejar redirecciones entre páginas
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones obtenidas
  const [totals, setTotals] = useState({
    totalQuejas: 0,
    totalQuejasAbiertas: 0,
    totalQuejasCerradas: 0,
    totalSugerencias: 0,
    totalSugerenciasAbiertas: 0,
    totalSugerenciasCerradas: 0,
  }); // Estado para almacenar los totales calculados
  const [loading, setLoading] = useState(true); // Estado para indicar si la página está cargando

  // Validar userID y variableModulo al cargar la página
  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Obtiene el userID desde localStorage
    const variableModulo = localStorage.getItem("variableModulo"); // Obtiene variableModulo desde localStorage

    console.log("userID:", userID); // Depuración: Verifica el valor de userID
    console.log("variableModulo:", variableModulo); // Depuración: Verifica el valor de variableModulo

    if (!userID || userID === "0") {
      // Si no hay userID o es igual a "0", redirige a "Por favor inicie sesión"
      router.push("/please-login");
      return;
    }

    if (variableModulo === "1") {
      // Si variableModulo es igual a "1", redirige a "Acceso Prohibido"
      router.push("/access-denied");
      return;
    }
  }, []); // Solo se ejecuta una vez, al montar el componente

  // Función para obtener y procesar los datos desde la API de gestión de opiniones
  const fetchReportData = async () => {
    setLoading(true); // Activa el indicador de carga
    console.log("Iniciando solicitud a la API de gestión de opiniones"); // Mensaje en consola para verificar el inicio de la solicitud

    try {
      // Realiza una solicitud GET a la API de gestión de opiniones con un parámetro de tiempo para evitar el caché
      const response = await fetch(`/api/manageopinion?timestamp=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      // Verifica si la respuesta es correcta
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json(); // Convierte la respuesta en JSON
      console.log("Opiniones recibidas en el frontend:", data.opinions); // Log para verificar las opiniones recibidas

      // Filtra las opiniones para mantener solo el último comentario de cada opinión
      const uniqueOpinions = data.opinions.reduce((acc: Opinion[], opinion: Opinion) => {
        const existingIndex = acc.findIndex((o) => o.opinion_ID === opinion.opinion_ID);
        if (existingIndex === -1) {
          acc.push(opinion); // Agrega la opinión si no existe en el acumulador
        } else {
          acc[existingIndex] = opinion; // Reemplaza la opinión existente con la más reciente
        }
        return acc;
      }, []);

      // Ordena las opiniones para mostrar primero las quejas y luego las sugerencias
      uniqueOpinions.sort((a: Opinion, b: Opinion) => a.opinion_TypeID - b.opinion_TypeID);

      // Calcula los totales en el frontend a partir de las opiniones procesadas
      const totalsCalculated = {
        totalQuejas: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 1).length,
        totalQuejasAbiertas: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 1 && opinion.estado === "Abierto").length,
        totalQuejasCerradas: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 1 && opinion.estado === "Cerrado").length,
        totalSugerencias: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 2).length,
        totalSugerenciasAbiertas: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 2 && opinion.estado === "Abierto").length,
        totalSugerenciasCerradas: uniqueOpinions.filter((opinion: Opinion) => opinion.opinion_TypeID === 2 && opinion.estado === "Cerrado").length,
      };

      setOpinions(uniqueOpinions); // Actualiza las opiniones en el estado
      setTotals(totalsCalculated); // Actualiza los totales en el estado
      console.log("Totales calculados en el frontend:", totalsCalculated); // Log para verificar los totales calculados en el frontend
      setLoading(false); // Desactiva el indicador de carga
    } catch (error) {
      console.error("Error al cargar los datos:", error); // Log en caso de error
      setLoading(false); // Desactiva el indicador de carga si hay un error
    }
  };

  // useEffect para cargar los datos automáticamente al montar el componente
  useEffect(() => {
    fetchReportData(); // Llama a la función para cargar los datos al inicio
  }, []); // Solo se ejecuta una vez, al montar el componente

  // Función para actualizar los datos manualmente al hacer clic en el botón "Actualizar"
  const handleRefresh = () => {
    fetchReportData(); // Llama a la función para recargar los datos
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {loading && <p className={styles.loadingText}>Cargando datos...</p>}

      {!loading && (
        <>
          <div className={styles.totalsWrapper}>
            <div className={styles.totalItem}>
              <div className={styles.totalLabel}>Total de Quejas</div>
              <div className={styles.totalNumber}>{totals.totalQuejas}</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalLabel}>Total de Sugerencias</div>
              <div className={styles.totalNumber}>{totals.totalSugerencias}</div>
            </div>
          </div>

          <div className={styles.chartsContainer}>
            <iframe
              className={styles.lookerChart}
              src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
              allowFullScreen
            ></iframe>
            <iframe
              className={styles.lookerChart}
              src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
              allowFullScreen
            ></iframe>
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
