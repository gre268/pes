"use client"; // Este archivo se ejecuta en el lado del cliente (navegador).

import styles from "./gestionOpinion.module.css"; // Importa los estilos para este componente.
import React, { useState, useEffect } from "react"; // Importa React y hooks necesarios para manejar el estado y efectos.
import { useRouter } from "next/navigation"; // Importa useRouter para manejar la navegación.

// Definimos la estructura del objeto de Opinión.
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string; // Tipo de la opinión (queja o sugerencia).
  description: string; // Descripción de la opinión.
  comment: string; // Comentario asociado a la opinión.
  estado: string; // Estado de la opinión (abierto o cerrado).
  nombre: string; // Nombre del usuario.
  apellido: string; // Apellido del usuario.
  cedula: string; // Cédula del usuario.
  fecha_registro: string; // Fecha en que se registró la opinión.
}

export default function GestionOpiniones() {
  // Definimos los estados locales del componente.
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Almacena las opiniones obtenidas desde la API.
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar mientras se obtienen los datos.
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Opinión seleccionada por el usuario.
  const [comment, setComment] = useState<string>(""); // Comentario de la opinión seleccionada.
  const [status, setStatus] = useState<string>("Abierto"); // Estado de la opinión seleccionada (Abierto/Cerrado).
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación de opiniones.
  const itemsPerPage = 10; // Número de opiniones mostradas por página.
  const router = useRouter(); // Instancia del router para manejar redirecciones.

  // Efecto para cargar las opiniones cuando se monta el componente.
  useEffect(() => {
    fetchOpinions(); // Llamada para obtener las opiniones desde la API.
  }, []);

  // Función para obtener las opiniones desde la API.
  const fetchOpinions = async () => {
    try {
      setLoading(true); // Activa el indicador de carga.
      const response = await fetch("/api/manageopinion", {
        method: "GET", // Realizamos una solicitud GET a la API.
      });

      if (!response.ok) throw new Error("Error al obtener las opiniones"); // Si la respuesta no es exitosa, lanza un error.

      const data = await response.json(); // Convertimos la respuesta a JSON.
      setOpinions(data.opinions); // Guardamos las opiniones en el estado local.
    } catch (error) {
      console.error("Error al obtener las opiniones:", error); // Imprimimos el error en la consola.
    } finally {
      setLoading(false); // Desactiva el indicador de carga.
    }
  };

  // Función para manejar la selección de una opinión al hacer clic en una fila de la tabla.
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Establece la opinión seleccionada.
    setComment(opinion.comment || ""); // Establece el comentario asociado (si no hay, lo deja vacío).
    setStatus(opinion.estado); // Establece el estado de la opinión.
  };

  // Función para manejar cambios en el comentario.
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualiza el estado con el valor del comentario.
  };

  // Función para manejar cambios en el estado (Abierto/Cerrado).
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualiza el estado con el valor seleccionado.
  };

  // Función para guardar los cambios en el comentario y el estado de la opinión seleccionada.
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch(`/api/manageopinion`, {
          method: "PUT", // Realizamos una solicitud PUT para actualizar la opinión.
          headers: {
            "Content-Type": "application/json", // Indicamos que el contenido es JSON.
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID,
            comment, // Enviamos el comentario actualizado.
            status: status === "Abierto" ? "Abierto" : "Cerrado", // Enviamos el estado actualizado.
          }),
        });

        if (response.ok) {
          alert("¡Cambios realizados con éxito!"); // Si la solicitud fue exitosa, muestra un mensaje de éxito.
          fetchOpinions(); // Recarga las opiniones para reflejar los cambios.
          handleClear(); // Limpia la selección después de guardar.
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la información:", errorData.message);
          alert("Error al actualizar la información. Por favor, inténtelo de nuevo."); // Muestra un mensaje de error si ocurre un problema.
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("Error al guardar los cambios. Verifique su conexión y vuelva a intentarlo."); // Muestra un mensaje de error si falla la solicitud.
      }
    }
  };

  // Función para limpiar la opinión seleccionada y los campos de entrada.
  const handleClear = () => {
    setSelectedOpinion(null); // Limpia la selección de la opinión.
    setComment(""); // Limpia el campo del comentario.
    setStatus("Abierto"); // Restablece el estado al valor por defecto (Abierto).
  };

  // Función para manejar la paginación de las opiniones.
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>Gestión de Opiniones</h1>

      {loading ? (
        <p>Cargando opiniones...</p> // Indicador de carga mientras se obtienen las opiniones.
      ) : (
        <>
          {/* Formulario para mostrar y editar detalles de la opinión */}
          <div className={styles.opinionForm}>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={selectedOpinion?.description || ""} // Mostramos la descripción de la opinión seleccionada.
              className={styles.textarea}
              readOnly={true} // La descripción no puede ser editada.
            />
            <textarea
              name="comentario"
              placeholder="Comentario"
              value={comment} // Muestra el comentario de la opinión seleccionada.
              onChange={handleCommentChange} // Maneja cambios en el comentario.
              className={styles.textarea}
            />
          </div>

          {/* Contenedor para mostrar los botones de estado (Abierto/Cerrado) */}
          <div className={styles.estadoContainer}>
            <h3 className={styles.estadoLabel}>Estado</h3>
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Abierto"
                  checked={status === "Abierto"} // Selecciona el botón "Abierto" si el estado es "Abierto".
                  onChange={handleStatusChange} // Maneja el cambio de estado a "Abierto".
                />
                Abierto
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Cerrado"
                  checked={status === "Cerrado"} // Selecciona el botón "Cerrado" si el estado es "Cerrado".
                  onChange={handleStatusChange} // Maneja el cambio de estado a "Cerrado".
                />
                Cerrado
              </label>
            </div>
          </div>

          {/* Tabla para mostrar las opiniones disponibles */}
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
                    onClick={() => handleSelectOpinion(opinion)} // Al hacer clic en una fila, selecciona la opinión.
                    className={
                      selectedOpinion?.opinion_ID === opinion.opinion_ID
                        ? styles.selectedRow
                        : ""
                    } // Aplica un estilo diferente a la fila seleccionada.
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>
                      {opinion.fecha_registro
                        ? new Date(opinion.fecha_registro).toLocaleDateString()
                        : ""}
                    </td>
                    <td>{opinion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones para manejar acciones: Guardar, Menú, Limpiar, Salir */}
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
                  router.push("/login"); // Redirige al login si el usuario confirma que desea salir.
                }
              }}
              className={styles.pageButton}
            >
              Salir
            </button>
          </div>

          {/* Botones para manejar la paginación de las opiniones */}
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
