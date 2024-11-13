// Archivo: page.tsx
"use client"; // Indica que este archivo se ejecuta en el cliente (frontend).
import styles from "./report.module.css"; // Importa los estilos CSS específicos para este módulo.
import React, { useState, useEffect } from "react"; // Importa React y sus hooks.
import { useRouter } from "next/navigation"; // Para manejar la navegación entre páginas.

// Definimos la estructura de los totales, basada en los datos de `route.ts`.
interface Totals {
  totalQuejas: number;
  totalQuejasCerradas: number;
  totalQuejasAbiertas: number;
  totalSugerencias: number;
  totalSugerenciasCerradas: number;
  totalSugerenciasAbiertas: number;
}

// Definimos la estructura de cada opinión, incluyendo la información del usuario.
interface Opinion {
  id: number;              // ID de la opinión
  tipo: number;            // Tipo de la opinión (1 = Queja, 2 = Sugerencia)
  descripcion: string;     // Descripción de la opinión
  nombre: string;          // Nombre del usuario
  apellido: string;        // Apellido del usuario
  cedula: string;          // Cédula del usuario
  estado: string;          // Estado de la opinión (Abierto o Cerrado)
  fecha: string;           // Fecha de registro de la opinión
}

export default function Reportes() {
  const router = useRouter(); // Hook para manejar redirecciones entre páginas.
  const [totals, setTotals] = useState<Totals | null>(null); // Estado para almacenar los totales.
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones.
  const [loading, setLoading] = useState(true); // Estado de carga mientras se obtienen los datos.
  const [error, setError] = useState<string | null>(null); // Estado para manejar mensajes de error.
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la tabla.
  const itemsPerPage = 10; // Define el número de opiniones por página.

  // Función para obtener los datos del reporte desde la API sin usar caché.
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga.
    try {
      // Realiza una solicitud GET a la API para obtener los datos actualizados.
      const response = await fetch("/api/report", { cache: "no-store" });
      if (!response.ok) throw new Error("Error al obtener el reporte"); // Maneja errores de respuesta.

      const data = await response.json(); // Convierte la respuesta a formato JSON.
      setTotals(data.totals); // Almacena los totales en el estado `totals`.
      setOpinions(data.opinions); // Almacena las opiniones en el estado `opinions`.
      setLoading(false); // Desactiva el estado de carga.
    } catch (err) {
      console.error("Error al cargar los datos:", err); // Muestra el error en la consola.
      setError("Ocurrió un error al cargar los datos."); // Actualiza el estado de error.
      setLoading(false); // Desactiva el estado de carga.
    }
  };

  // Hook useEffect para obtener los datos cuando el componente se monta.
  useEffect(() => {
    fetchData(); // Llama a la función para cargar los datos al inicio.
  }, []); // El array vacío asegura que solo se ejecute una vez al montar.

  // Función para refrescar los datos manualmente cuando el usuario lo desee.
  const handleRefresh = () => {
    setOpinions([]); // Limpia los datos de opiniones antes de actualizar.
    setTotals(null); // Limpia los datos de totales antes de actualizar.
    fetchData(); // Vuelve a llamar a la función para obtener datos frescos.
  };

  // Función para cerrar sesión con confirmación.
  const handleLogout = () => {
    if (confirm("¿Está seguro de que desea salir?")) { // Muestra confirmación al usuario.
      alert("Gracias por utilizar el sistema"); // Mensaje de agradecimiento.
      router.push("/login"); // Redirige al usuario a la página de login.
    }
  };

  // Función para redirigir al menú principal.
  const handleMenu = () => {
    router.push("/menu"); // Redirige al usuario al menú principal.
  };

  // Calcula las opiniones que se deben mostrar en la página actual.
  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Función para avanzar a la siguiente página.
  const handleNextPage = () => setCurrentPage(currentPage + 1);

  // Función para retroceder a la página anterior.
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  // Si el estado de carga está activo, muestra un mensaje de "Cargando datos".
  if (loading) {
    return (
      <main className={styles.main}>
        <h2 className={styles.loadingText}>Cargando datos...</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Reportes</h1>

      {/* Sección de Totales usando text fields */}
      <div className={styles.totalsWrapper}>
        <input type="text" readOnly value={`Total de Quejas: ${totals?.totalQuejas || 0}`} className={styles.totalInput} />
        <input type="text" readOnly value={`Total de Sugerencias: ${totals?.totalSugerencias || 0}`} className={styles.totalInput} />
        <input type="text" readOnly value={`Total de Quejas Cerradas: ${totals?.totalQuejasCerradas || 0}`} className={styles.totalInput} />
        <input type="text" readOnly value={`Total de Sugerencias Cerradas: ${totals?.totalSugerenciasCerradas || 0}`} className={styles.totalInput} />
        <input type="text" readOnly value={`Total de Quejas Abiertas: ${totals?.totalQuejasAbiertas || 0}`} className={styles.totalInput} />
        <input type="text" readOnly value={`Total de Sugerencias Abiertas: ${totals?.totalSugerenciasAbiertas || 0}`} className={styles.totalInput} />
      </div>

      {/* Botón para actualizar datos de totales y tabla */}
      <div className={styles.buttonContainer}>
        <button onClick={handleRefresh} className={styles.pageButton}>Actualizar Totales y Tabla</button>
      </div>

      {/* Gráficos de Looker Studio */}
      <div className={styles.chartsContainer}>
        <iframe src="https://lookerstudio.google.com/embed/reporting/c304cffd-2de7-4fdb-bdb0-48b8d3d526a2/page/L56IE" width="100%" height="400" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
        <iframe src="https://lookerstudio.google.com/embed/reporting/7ece3cae-baaa-4a09-bed6-3a6a9132dc6a/page/L56IE" width="100%" height="400" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
      </div>

      {/* Tabla de opiniones con text fields en cada celda */}
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
                <td><input type="text" readOnly value={opinion.tipo === 1 ? "Queja" : "Sugerencia"} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={opinion.descripcion} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={opinion.nombre} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={opinion.apellido} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={opinion.cedula} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={new Date(opinion.fecha).toLocaleDateString("es-ES")} className={styles.cellInput} /></td>
                <td><input type="text" readOnly value={opinion.estado} className={styles.cellInput} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de Paginación */}
      <div className={styles.pagination}>
        {currentPage > 1 && <button onClick={handlePrevPage} className={styles.pageButton}>Anterior</button>}
        {opinions.length > currentPage * itemsPerPage && <button onClick={handleNextPage} className={styles.pageButton}>Siguiente</button>}
      </div>

      {/* Botones de acción */}
      <div className={styles.buttonContainer}>
        <button onClick={handleMenu} className={styles.pageButton}>Menú</button>
        <button onClick={handleLogout} className={styles.pageButton}>Salir</button>
      </div>
    </main>
  );
}
