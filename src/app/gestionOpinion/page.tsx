"use client"; // Este archivo se ejecuta en el lado del cliente.

import styles from "./gestionOpinion.module.css"; // Importa los estilos específicos.
import React, { useState, useEffect } from "react"; // Importa React y hooks necesarios.
import { useRouter } from "next/navigation"; // Importa `useRouter` para manejar la navegación.

// Definimos la estructura de los datos para la opinión.
interface Opinion {
  opinion_ID: number; // ID de la opinión.
  opinion_TypeID: number; // Tipo de la opinión (queja o sugerencia).
  opinion_type: string; // Tipo de la opinión (ej. queja o sugerencia).
  description: string; // Descripción de la opinión.
  comment: string; // Comentario adicional sobre la opinión.
  estado: string; // Estado de la opinión (abierto o cerrado).
  nombre: string; // Nombre del usuario.
  apellido: string; // Apellido del usuario.
  cedula: string; // Cédula del usuario.
  fecha_registro: string; // Fecha de registro de la opinión.
}

export default function GestionOpiniones() {
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Almacena las opiniones obtenidas desde la API.
  const [loading, setLoading] = useState(true); // Estado de carga.
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Opinión seleccionada.
  const [comment, setComment] = useState<string>(""); // Comentario de la opinión seleccionada.
  const [status, setStatus] = useState<string>("Abierto"); // Estado de la opinión seleccionada.
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la paginación.
  const itemsPerPage = 10; // Número de opiniones por página.
  const router = useRouter(); // Instancia del router.

  // Efecto para cargar las opiniones al montar el componente.
  useEffect(() => {
    fetchOpinions();
  }, []);

  // Función para obtener las opiniones desde la API.
  const fetchOpinions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/manageopinion", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Error al obtener las opiniones");

      const data = await response.json();
      setOpinions(data.opinions);
    } catch (error) {
      console.error("Error al obtener las opiniones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la selección de una opinión.
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion);
    setComment(opinion.comment || "");
    setStatus(opinion.estado);
  };

  // Función para manejar el cambio en el comentario.
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // Función para manejar el cambio de estado.
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  // Función para guardar los cambios en la opinión seleccionada.
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch("/api/manageopinion", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID,
            comment,
            status,
          }),
        });

        if (response.ok) {
          alert("¡Cambios realizados con éxito!");
          fetchOpinions(); // Recargar las opiniones.
          handleClear(); // Limpiar la selección.
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la información:", errorData.message);
          alert("Error al actualizar la información. Por favor, inténtelo de nuevo.");
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("Error al guardar los cambios. Verifique su conexión y vuelva a intentarlo.");
      }
    }
  };

  // Función para limpiar la selección y los campos de entrada.
  const handleClear = () => {
    setSelectedOpinion(null);
    setComment("");
    setStatus("Abierto");
  };

  // Manejo de la paginación.
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>Gestión de Opiniones</h1>

      {loading ? (
        <p>Cargando opiniones...</p>
      ) : (
        <>
          <div className={styles.opinionForm}>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={selectedOpinion?.description || ""}
              className={styles.textarea}
              readOnly={true}
            />
            <textarea
              name="comentario"
              placeholder="Comentario"
              value={comment}
              onChange={handleCommentChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.estadoContainer}>
            <h3 className={styles.estadoLabel}>Estado</h3>
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Abierto"
                  checked={status === "Abierto"}
                  onChange={handleStatusChange}
                />
                Abierto
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Cerrado"
                  checked={status === "Cerrado"}
                  onChange={handleStatusChange}
                />
                Cerrado
              </label>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.opinionTable}>
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
                {paginatedOpinions.map((opinion, index) => (
                  <tr
                    key={opinion.opinion_ID}
                    onClick={() => handleSelectOpinion(opinion)}
                    className={selectedOpinion?.opinion_ID === opinion.opinion_ID ? styles.selectedRow : ""}
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>{opinion.fecha_registro ? new Date(opinion.fecha_registro).toLocaleDateString() : ""}</td>
                    <td>{opinion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.pageButton}>
              Guardar
            </button>
            <button onClick={() => router.push("/menu")} className={styles.pageButton}>
              Menú
            </button>
            <button onClick={handleClear} className={styles.pageButton}>
              Limpiar
            </button>
            <button
              onClick={() => {
                if (window.confirm("¿Está seguro de que quiere salir?")) {
                  router.push("/login");
                }
              }}
              className={styles.pageButton}
            >
              Salir
            </button>
          </div>

          <div className={styles.pagination}>
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)} className={styles.pageButton}>
                Anterior
              </button>
            )}
            {opinions.length > currentPage * itemsPerPage && (
              <button onClick={() => setCurrentPage(currentPage + 1)} className={styles.pageButton}>
                Siguiente
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
