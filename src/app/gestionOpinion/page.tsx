"use client"; // Indicamos que este archivo se ejecuta en el cliente (lado del navegador).

import styles from "./gestionOpinion.module.css"; // Importamos los estilos específicos para el módulo de gestión de opiniones.
import React, { useState, useEffect } from "react"; // Importamos React y los hooks `useState` y `useEffect`.
import { useRouter } from "next/navigation"; // Importamos `useRouter` para manejar redirecciones dentro de Next.js.

// Definimos la estructura de datos para las opiniones
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string;
  description: string;
  comment: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string;
}

export default function GestionOpiniones() {
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones obtenidas de la API.
  const [loading, setLoading] = useState(true); // Estado de carga para gestionar la visualización durante la obtención de datos.
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada por el usuario.
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario de la opinión seleccionada.
  const [status, setStatus] = useState<string>("Abierto"); // Estado para manejar el estado (abierto o cerrado) de la opinión seleccionada.
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la tabla.
  const itemsPerPage = 10; // Número de opiniones que se mostrarán por página.
  const router = useRouter(); // Instancia del router para manejar la navegación.

  // Efecto para obtener opiniones cuando el componente se monta
  useEffect(() => {
    fetchOpinions(); // Llamamos a la función para obtener las opiniones cuando el componente se monta.
  }, []);

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      setLoading(true); // Establecemos `loading` en true para mostrar un indicador de carga.
      const response = await fetch("/api/gestionOpinion", {
        method: "GET", // Usamos el método GET para obtener los datos de la API.
      });

      if (!response.ok) throw new Error("Error al obtener las opiniones");

      const data = await response.json();
      setOpinions(data.opinions); // Actualizamos el estado con las opiniones recibidas.
    } catch (error) {
      console.error("Error al obtener las opiniones:", error); // Mostramos el error en la consola.
    } finally {
      setLoading(false); // Ocultamos el indicador de carga una vez finalizada la obtención.
    }
  };

  // Función para manejar la selección de una opinión en la tabla
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Establecemos la opinión seleccionada.
    setComment(opinion.comment || ""); // Actualizamos el comentario (si no hay comentario, establecemos un string vacío).
    setStatus(opinion.estado); // Establecemos el estado de la opinión.
  };

  // Función para manejar el cambio en el campo de comentario
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualizamos el estado del comentario con el valor ingresado.
  };

  // Función para manejar el cambio en los botones de radio del estado (abierto o cerrado)
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualizamos el estado con el valor seleccionado (abierto o cerrado).
  };

  // Función para guardar los cambios en la opinión seleccionada
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch(`/api/gestionOpinion`, {
          method: "PUT", // Usamos el método PUT para actualizar los datos de la opinión.
          headers: {
            "Content-Type": "application/json", // Indicamos que estamos enviando datos en formato JSON.
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID, // Incluimos el ID de la opinión seleccionada.
            comment, // Incluimos el comentario actualizado.
            status: status === "Abierto" ? "Abierto" : "Cerrado", // Incluimos el estado actualizado.
          }),
        });

        if (response.ok) {
          alert("¡Cambios realizados con éxito!"); // Mostramos un mensaje si la actualización fue exitosa.
          fetchOpinions(); // Recargamos las opiniones para reflejar los cambios realizados.
          handleClear(); // Limpiamos la selección después de guardar los cambios.
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la información:", errorData.message);
          alert("Error al actualizar la información. Por favor, inténtelo de nuevo."); // Mostramos un mensaje de error si la actualización falla.
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("Error al guardar los cambios. Verifique su conexión y vuelva a intentarlo."); // Mostramos un mensaje de error si ocurre un problema en la solicitud.
      }
    }
  };

  // Función para limpiar la opinión seleccionada y los campos de entrada
  const handleClear = () => {
    setSelectedOpinion(null); // Limpiamos la selección de la opinión.
    setComment(""); // Limpiamos el campo de comentario.
    setStatus("Abierto"); // Restablecemos el estado a "Abierto".
  };

  // Obtenemos las opiniones para la página actual (paginación)
  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>Gestión de Opiniones</h1>

      {loading ? (
        <p>Cargando opiniones...</p> // Indicador de carga mientras las opiniones se están obteniendo.
      ) : (
        <>
          {/* Formulario para mostrar y editar detalles de la opinión */}
          <div className={styles.opinionForm}>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={selectedOpinion?.description || ""} // Mostramos la descripción de la opinión seleccionada (si no hay ninguna, está vacío).
              className={styles.textarea}
              readOnly={true} // La descripción no se puede editar.
            />
            <textarea
              name="comentario"
              placeholder="Comentario"
              value={comment} // Mostramos y actualizamos el comentario ingresado.
              onChange={handleCommentChange} // Función para manejar cambios en el comentario.
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
                  checked={status === "Abierto"} // El botón de "Abierto" está seleccionado si el estado es "Abierto".
                  onChange={handleStatusChange} // Función para manejar el cambio de estado.
                />
                Abierto
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Cerrado"
                  checked={status === "Cerrado"} // El botón de "Cerrado" está seleccionado si el estado es "Cerrado".
                  onChange={handleStatusChange} // Función para manejar el cambio de estado.
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
                    onClick={() => handleSelectOpinion(opinion)} // Cuando se hace clic en una fila, se selecciona la opinión.
                    className={
                      selectedOpinion?.opinion_ID === opinion.opinion_ID
                        ? styles.selectedRow
                        : ""
                    } // Aplicamos un estilo diferente a la fila seleccionada.
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
