// Archivo: page.tsx
"use client"; // Indica que este archivo se ejecuta en el lado del cliente.

import styles from "./report.module.css"; // Importa los estilos específicos del módulo de reportes.
import React, { useEffect, useState } from "react"; // Importa React y hooks para manejar el estado y efectos.
import { useRouter } from "next/navigation"; // Importa `useRouter` para manejar la navegación.

// Define la estructura de los totales
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

// Define la estructura de cada opinión
interface Opinion {
  id: number;
  tipo: number; // Tipo de la opinión (1 = Queja, 2 = Sugerencia).
  descripcion: string; // Descripción de la opinión.
  nombre: string; // Nombre del usuario.
  apellido: string; // Apellido del usuario.
  cedula: string; // Cédula del usuario.
  estado: string; // Estado de la opinión (Abierto o Cerrado).
  fecha: string; // Fecha de registro de la opinión.
}

// Componente principal de la página de reportes
export default function Reportes() {
  const router = useRouter(); // Hook para manejar la navegación.
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para los totales.
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para las opiniones.
  const [loading, setLoading] = useState(true); // Estado de carga mientras se obtienen los datos.
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores.

  // Hook para cargar los datos al montar el componente
  useEffect(() => {
    fetchData(); // Llama a la función para obtener datos desde la API.
  }, []);

  // Función para obtener los datos del reporte desde la API
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga mientras se obtienen los datos.
    try {
      // Llama a la API para obtener los datos actuales de la base de datos
      const response = await fetch("/api/report", {
        cache: "no-store", // Asegura que siempre obtenga datos actualizados, sin caché.
      });
      if (!response.ok) throw new Error("Error al obtener el reporte");

      const data = await response.json(); // Convierte la respuesta en JSON.
      if (data && typeof data === "object") {
        setTotals(data.totals); // Actualiza los totales con los datos obtenidos.
        setOpinions(data.opinions); // Actualiza las opiniones con los datos obtenidos.
      } else {
        throw new Error("Formato de datos del reporte incorrecto");
      }
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Ocurrió un error al cargar los datos. Intente nuevamente más tarde."); // Muestra mensaje de error.
    } finally {
      setLoading(false); // Desactiva el estado de carga.
    }
  };

  // Función para refrescar los datos al hacer clic en "Actualizar Datos"
  const handleRefresh = () => {
    fetchData(); // Llama a `fetchData()` para obtener los datos actualizados.
  };

  // Muestra mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <main className={styles.main}>
        <h2 className={styles.loadingText}>Cargando datos...</h2>
      </main>
    );
  }

  // Muestra mensaje de error si ocurrió un problema al obtener los datos
  if (error) {
    return (
      <main className={styles.main}>
        <h2 className={styles.errorText}>{error}</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Quejas</p>
          <p className={styles.value}>{totals?.totalQuejas || 0}</p>
        </div>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Sugerencias</p>
          <p className={styles.value}>{totals?.totalSugerencias || 0}</p>
        </div>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Quejas Cerradas</p>
          <p className={styles.value}>{totals?.totalQuejasCerradas || 0}</p>
        </div>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Sugerencias Cerradas</p>
          <p className={styles.value}>{totals?.totalSugerenciasCerradas || 0}</p>
        </div>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Quejas Abiertas</p>
          <p className={styles.value}>{totals?.totalQuejasAbiertas || 0}</p>
        </div>
        <div className={styles.totalItem}>
          <p className={styles.label}>Total de Sugerencias Abiertas</p>
          <p className={styles.value}>{totals?.totalSugerenciasAbiertas || 0}</p>
        </div>
      </div>

      {/* Lista de opiniones */}
      <div className={styles.listContainer}>
        {opinions.map((opinion) => (
          <div key={opinion.id} className={styles.listItem}>
            <p><strong>Opinión:</strong> {opinion.tipo === 1 ? "Queja" : "Sugerencia"}</p>
            <p><strong>Descripción:</strong> {opinion.descripcion}</p>
            <p><strong>Nombre:</strong> {opinion.nombre} {opinion.apellido}</p>
            <p><strong>Cédula:</strong> {opinion.cedula}</p>
            <p><strong>Fecha de Registro:</strong> {new Date(opinion.fecha).toLocaleDateString('es-ES')}</p>
            <p><strong>Estado:</strong> {opinion.estado}</p>
          </div>
        ))}
      </div>

      {/* Botón de Actualización */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.button}>Actualizar Datos</button>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
      </div>
    </main>
  );
}
