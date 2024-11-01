"use client"; // Este código se ejecuta en el cliente

import styles from "./report.module.css"; // Importamos los estilos del módulo
import React, { useEffect, useState } from "react"; // Importamos React y hooks
import { useRouter } from "next/navigation"; // Importamos useRouter para la navegación

// Definimos la estructura para los totales
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

export default function Reportes() {
  const router = useRouter(); // Instancia de router para manejar la navegación
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales

  // useEffect para cargar los totales desde la API cuando se carga el componente
  useEffect(() => {
    fetchTotals();
  }, []);

  // Función para obtener los totales desde la API
  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) {
        throw new Error("Error al obtener los totales");
      }
      const data = await response.json();
      setTotals(data); // Almacenamos los totales en el estado
    } catch (error) {
      console.error("Error al cargar los totales:", error);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de totales */}
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsContainer}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalQuejas : 0}
              className={styles.inputBlackText}
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalSugerencias : 0}
              className={styles.inputBlackText}
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalQuejasCerradas : 0}
              className={styles.inputBlackText}
            />
          </div>
        </div>
        <div className={styles.totalsContainer}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalSugerenciasAbiertas : 0}
              className={styles.inputBlackText}
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalQuejasAbiertas : 0}
              className={styles.inputBlackText}
            />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input
              type="text"
              readOnly
              value={totals ? totals.totalSugerenciasCerradas : 0}
              className={styles.inputBlackText}
            />
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE"
            width="400"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className={styles.chart}>
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE"
            width="400"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </div>

      {/* Tabla de detalles */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
              <td colSpan={6}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botones de Salir y Menú */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
