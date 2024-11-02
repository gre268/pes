"use client";

import styles from "./report.module.css";
import React, { useEffect, useState } from "react";
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
  opinion_ID: number;
  tipo: string;
  descripcion: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fecha: string;
  estado: string;
}

export default function Reportes() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const opinionsPerPage = 10;

  useEffect(() => {
    fetchTotals();
    fetchOpinions();
  }, []);

  const fetchTotals = async () => {
    try {
      const response = await fetch("/api/reportTotals");
      if (!response.ok) throw new Error("Error al obtener los totales");
      const data = await response.json();
      setTotals(data);
    } catch (error) {
      console.error("Error al cargar los totales:", error);
    }
  };

  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/reportOpinions");
      if (!response.ok) throw new Error("Error al obtener las opiniones");
      const data = await response.json();
      setOpinions(data);
    } catch (error) {
      console.error("Error al cargar las opiniones:", error);
    }
  };

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * opinionsPerPage,
    currentPage * opinionsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>
      <div className={styles.totalsWrapper}>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Quejas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasCerradas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Quejas Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalQuejasAbiertas : 0} className={styles.inputBlackText} />
          </div>
        </div>
        <div className={styles.totalsColumn}>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias</p>
            <input type="text" readOnly value={totals ? totals.totalSugerencias : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Abiertas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasAbiertas : 0} className={styles.inputBlackText} />
          </div>
          <div className={styles.totalItem}>
            <p>Total de Sugerencias Cerradas</p>
            <input type="text" readOnly value={totals ? totals.totalSugerenciasCerradas : 0} className={styles.inputBlackText} />
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        {/* Gráficos embebidos */}
      </div>

      <div className={styles.opinionList}>
        {paginatedOpinions.map((opinion) => (
          <div key={opinion.opinion_ID} className={styles.opinionItem}>
            <p><strong>Opinión:</strong> {opinion.tipo}</p>
            <p><strong>Descripción:</strong> {opinion.descripcion}</p>
            <p><strong>Nombre:</strong> {opinion.nombre} {opinion.apellido}</p>
            <p><strong>Cédula:</strong> {opinion.cedula}</p>
            <p><strong>Fecha de Registro:</strong> {opinion.fecha}</p>
            <p><strong>Estado:</strong> {opinion.estado}</p>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
        {opinions.length > currentPage * opinionsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/menu")} className={styles.button}>Menú</button>
        <button onClick={() => confirm("¿Está seguro de salir?") && router.push("/login")} className={styles.button}>Salir</button>
      </div>
    </main>
  );
}
