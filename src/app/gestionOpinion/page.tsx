"use client"; // Este archivo se ejecuta en el cliente, no en el servidor

import styles from "./gestionOpinion.module.css"; // Importamos los estilos específicos para este módulo
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones

// Definimos el tipo de datos para las opiniones
interface Opinion {
  opinion_ID: number;
  opinion_TypeID: number;
  description: string;
  comment: string;
  status: string;
  name: string;
  lastName1: string;
  cedula: string;
  created_At: string;
}

export default function GestionOpiniones() {
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones obtenidas desde la base de datos
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario de la opinión seleccionada
  const [status, setStatus] = useState<string>("Abierto"); // Estado para manejar el estado de la opinión seleccionada
  const router = useRouter(); // Creamos una instancia de router para manejar redirecciones

  // useEffect para cargar las opiniones desde la base de datos al montar el componente
  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const response = await fetch("/api/gestionOpinion"); // Llamada a la API para obtener opiniones
        if (!response.ok) {
          throw new Error("Error al obtener las opiniones"); // Lanzamos un error si la respuesta no es exitosa
        }
        const data = await response.json();
        setOpinions(data.opinions); // Almacenamos las opiniones obtenidas en el estado
      } catch (error) {
        console.error("Error al obtener las opiniones:", error); // Mostramos el error en la consola
      }
    };
    fetchOpinions(); // Ejecutamos la función fetchOpinions al montar el componente
  }, []);

  // Función para manejar la selección de una opinión al hacer clic en una fila
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Guardamos la opinión seleccionada en el estado
    setComment(opinion.comment || ""); // Cargamos el comentario actual de la opinión, o vacío si no existe
    setStatus(opinion.status === "Abierto" ? "Abierto" : "Cerrado"); // Establecemos el estado de la opinión
  };

  // Función para manejar el cambio en el campo de comentario
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualizamos el estado del comentario
  };

  // Función para manejar el cambio en los radio buttons de estado
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualizamos el estado de la opinión
  };

  // Función para guardar los cambios en el comentario y el estado
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch(`/api/gestionOpinion`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID, // ID de la opinión a actualizar
            comment,
            status: status === "Abierto" ? "Abierto" : "Cerrado", // Guardamos el estado en mayúscula
          }),
        });

        if (response.ok) {
          alert("Información actualizada con éxito."); // Mostramos mensaje de éxito
          setSelectedOpinion({ ...selectedOpinion, comment, status }); // Actualizamos el estado localmente
          const updatedOpinions = opinions.map((op) =>
            op.opinion_ID === selectedOpinion.opinion_ID ? { ...op, comment, status } : op
          );
          setOpinions(updatedOpinions); // Actualizamos la lista de opiniones en el estado
        } else {
          console.error("Error al actualizar la información"); // Mostramos error en consola si la actualización falla
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error); // Capturamos y mostramos cualquier error
      }
    }
  };

  return (
    <main className={styles.main}>
      {/* Encabezado del módulo */}
      <div className={styles.headerText}>
        <h1>Opiniones</h1>
      </div>

      {/* Formulario para ver y editar los detalles de la opinión */}
      <div className={styles.opinionForm}>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={selectedOpinion?.description || ""} // Mostramos la descripción de la opinión seleccionada
          className={styles.textarea}
          readOnly={true} // Campo de descripción solo lectura
        />
        <textarea
          name="comentario"
          placeholder="Comentario"
          value={comment} // Mostramos y editamos el comentario de la opinión seleccionada
          onChange={handleCommentChange} // Manejador para actualizar el comentario
          className={styles.textarea}
        />
      </div>

      {/* Sección de estado con botones de radio para elegir entre Abierto y Cerrado */}
      <div className={styles.estadoContainer}>
        <h3>Estado</h3>
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

      {/* Tabla de opiniones con los datos obtenidos de la base de datos */}
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
            {opinions.map((opinion, index) => (
              <tr
                key={opinion.opinion_ID}
                onClick={() => handleSelectOpinion(opinion)} // Al hacer clic seleccionamos la opinión
                className={
                  selectedOpinion?.opinion_ID === opinion.opinion_ID ? styles.selectedRow : "" // Aplicamos un estilo especial si la opinión está seleccionada
                }
              >
                <td>{index + 1}</td>
                <td>{opinion.opinion_TypeID === 1 ? "Queja" : "Sugerencia"}</td>
                <td>{opinion.description}</td>
                <td>{opinion.name}</td>
                <td>{opinion.lastName1}</td>
                <td>{opinion.cedula}</td>
                <td>{new Date(opinion.created_At).toLocaleDateString()}</td>
                <td>{opinion.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de acción para guardar y navegar */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>
          Guardar
        </button>
        <button onClick={() => router.push("/menu")} className={styles.menuButton}>
          Menú
        </button>
        <button onClick={() => router.push("/login")} className={styles.logoutButton}>
          Salir
        </button>
      </div>
    </main>
  );
}
