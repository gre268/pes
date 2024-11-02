"use client"; // Indicamos que este archivo se ejecuta en el cliente

import styles from "./gestionOpinion.module.css"; // Importamos los estilos específicos para este módulo
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones en Next.js

// Definimos la estructura de datos para las opiniones
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string; // Tipo de la opinión (queja o sugerencia)
  description: string;
  comment: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string; // Fecha en la que se registró la opinión
}

export default function GestionOpiniones() {
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones obtenidas desde la API
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar la pantalla de carga mientras se obtienen las opiniones
  const [loadStatus, setLoadStatus] = useState<string>(""); // Estado para mostrar si la carga fue exitosa o hubo un error
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario de la opinión seleccionada
  const [status, setStatus] = useState<string>("Abierto"); // Estado para manejar el estado de la opinión seleccionada
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la tabla
  const itemsPerPage = 10; // Número de opiniones por página
  const router = useRouter(); // Instancia de router para manejar redirecciones

  // useEffect para cargar las opiniones desde la API al montar el componente
  useEffect(() => {
    fetchOpinions(); // Llamamos a la función que obtiene las opiniones
  }, []);

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      setLoading(true); // Activamos el estado de carga al iniciar la solicitud de datos
      setLoadStatus("Cargando opiniones..."); // Indicamos que estamos en proceso de carga
      const response = await fetch("/api/manageopinion"); // Llamada a la nueva ruta de API para obtener opiniones

      if (!response.ok) {
        const errorData = await response.json(); // Parseamos el error detallado desde el backend
        throw new Error(errorData.message || "Error desconocido al obtener las opiniones"); // Lanza un error con el mensaje detallado
      }

      const data = await response.json(); // Parseamos la respuesta JSON si es exitosa
      setOpinions(data.opinions); // Almacena las opiniones obtenidas en el estado
      setLoadStatus("Opiniones cargadas exitosamente."); // Mensaje de éxito si se cargan correctamente
    } catch (error: any) {
      console.error("Error al obtener las opiniones:", error.message); // Muestra el error en la consola si falla la obtención
      setLoadStatus(`Error al cargar opiniones: ${error.message}`); // Mensaje de error detallado para el usuario
    } finally {
      setLoading(false); // Desactiva el estado de carga una vez que los datos se obtienen o se produce un error
    }
  };

  // Función para manejar la selección de una opinión al hacer clic en una fila
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Guarda la opinión seleccionada en el estado
    setComment(opinion.comment || ""); // Carga el comentario actual de la opinión o vacío si no existe
    setStatus(opinion.estado === "Abierto" ? "Abierto" : "Cerrado"); // Establece el estado actual de la opinión
  };

  // Función para manejar el cambio en el campo de comentario
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualiza el estado del comentario
  };

  // Función para manejar el cambio en los radio buttons de estado
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualiza el estado de la opinión seleccionada
  };

  // Función para guardar los cambios en el comentario y el estado de la opinión seleccionada
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch(`/api/manageopinion`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID, // ID de la opinión a actualizar
            comment,
            estado: status === "Abierto" ? "Abierto" : "Cerrado", // Guarda el estado en mayúscula
          }),
        });

        if (response.ok) {
          alert("Información actualizada con éxito."); // Muestra un mensaje de éxito
          setSelectedOpinion({ ...selectedOpinion, comment, estado: status }); // Actualiza la opinión seleccionada localmente
          const updatedOpinions = opinions.map((op) =>
            op.opinion_ID === selectedOpinion.opinion_ID ? { ...op, comment, estado: status } : op
          );
          setOpinions(updatedOpinions); // Actualiza la lista de opiniones en el estado
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la información:", errorData.message); // Log del error específico en consola
          alert(`Error al actualizar la información: ${errorData.message}`); // Muestra el mensaje de error detallado al usuario
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error); // Captura y muestra cualquier error
      }
    }
  };

  // Función para cambiar de página en la tabla
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber); // Actualiza el estado de la página actual
  };

  // Función para manejar el botón de salir con confirmación
  const handleLogout = () => {
    const confirmExit = confirm("¿Estás seguro de que deseas salir?");
    if (confirmExit) {
      router.push("/login");
    }
  };

  // Calcular las opiniones para la página actual
  const indexOfLastOpinion = currentPage * itemsPerPage;
  const indexOfFirstOpinion = indexOfLastOpinion - itemsPerPage;
  const currentOpinions = opinions.slice(indexOfFirstOpinion, indexOfLastOpinion);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(opinions.length / itemsPerPage);

  return (
    <main className={styles.main}>
      {/* Pantalla de carga */}
      {loading ? (
        <div className={styles.loadingContainer}> {/* Contenedor de la pantalla de carga */}
          <p className={styles.loadingText}>{loadStatus}</p> {/* Texto de carga o mensaje de error */}
        </div>
      ) : (
        <>
          {/* Encabezado del módulo */}
          <div className={styles.headerText}>
            <h1>Opiniones</h1> {/* Título del módulo */}
          </div>

          {/* Formulario para ver y editar los detalles de la opinión */}
          <div className={styles.opinionForm}>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={selectedOpinion?.description || ""} // Muestra la descripción de la opinión seleccionada
              className={styles.textarea}
              readOnly={true} // Campo de descripción solo lectura
            />
            <textarea
              name="comentario"
              placeholder="Comentario"
              value={comment} // Muestra y permite editar el comentario de la opinión seleccionada
              onChange={handleCommentChange} // Manejador para actualizar el comentario
              className={styles.textarea}
            />
          </div>

          {/* Sección de estado con botones de radio para elegir entre Abierto y Cerrado */}
          <div className={styles.estadoContainer}>
            <h3>Estado</h3> {/* Título para el estado de la opinión */}
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Abierto"
                  checked={status === "Abierto"} // Verifica si el estado es 'Abierto'
                  onChange={handleStatusChange} // Manejador para cambiar el estado a 'Abierto'
                />
                Abierto
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="Cerrado"
                  checked={status === "Cerrado"} // Verifica si el estado es 'Cerrado'
                  onChange={handleStatusChange} // Manejador para cambiar el estado a 'Cerrado'
                />
                Cerrado
              </label>
            </div>
          </div>

          {/* Tabla de opiniones con los datos obtenidos de la API */}
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
                {currentOpinions.map((opinion, index) => (
                  <tr
                    key={opinion.opinion_ID}
                    onClick={() => handleSelectOpinion(opinion)} // Al hacer clic seleccionamos la opinión
                    className={
                      selectedOpinion?.opinion_ID === opinion.opinion_ID ? styles.selectedRow : "" // Estilo especial si está seleccionada
                    }
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>{new Date(opinion.fecha_registro).toLocaleDateString()}</td>
                    <td>{opinion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones de paginación */}
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={styles.pageButton}
              >
                Página {index + 1}
              </button>
            ))}
          </div>

          {/* Botones de acción para guardar y navegar */}
          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.saveButton}>
              Guardar
            </button>
            <button onClick={() => router.push("/menu")} className={styles.menuButton}>
              Menú
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Salir
            </button>
          </div>
        </>
      )}
    </main>
  );
}
