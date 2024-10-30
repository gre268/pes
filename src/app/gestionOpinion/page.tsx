"use client"; // Este código se ejecuta en el cliente
import styles from "./gestionOpinion.module.css"; // Importamos los estilos específicos para este módulo
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones

// Definimos el tipo para las opiniones
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
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones desde la base de datos
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario
  const [status, setStatus] = useState<string>("abierto"); // Estado para manejar el estado de la opinión
  const router = useRouter(); // Creamos una instancia de router para manejar redirecciones

  // useEffect para cargar las opiniones desde la base de datos al montar el componente
  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const response = await fetch("/api/gestionOpinion"); // Llamada a la API para obtener opiniones
        if (!response.ok) {
          throw new Error("Error al obtener las opiniones");
        }
        const data = await response.json();
        setOpinions(data.opinions); // Almacenamos las opiniones en el estado
      } catch (error) {
        console.error("Error al obtener las opiniones:", error);
      }
    };
    fetchOpinions();
  }, []);

  // Función para manejar la selección de una opinión al hacer clic en una fila
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Establecemos la opinión seleccionada
    setComment(opinion.comment || ""); // Cargamos el comentario actual
    setStatus(opinion.status === "Abierto" ? "abierto" : "cerrado"); // Cargamos el estado actual
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
            opinion_ID: selectedOpinion.opinion_ID,
            comment,
            status: status === "abierto" ? "Abierto" : "Cerrado",
          }),
        });
        if (response.ok) {
          alert("Información actualizada con éxito.");
          setSelectedOpinion({ ...selectedOpinion, comment, status }); // Actualizamos el estado localmente
          const updatedOpinions = opinions.map((op) =>
            op.opinion_ID === selectedOpinion.opinion_ID
              ? { ...op, comment, status }
              : op
          );
          setOpinions(updatedOpinions); // Actualizamos la lista de opiniones en el estado
        } else {
          console.error("Error al actualizar la información");
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.headerText}>
        <h1>Opiniones</h1>
      </div>

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
        <h3>Estado</h3>
        <div className={styles.radioContainer}>
          <label>
            <input
              type="radio"
              name="estado"
              value="abierto"
              checked={status === "abierto"}
              onChange={handleStatusChange}
            />
            Abierto
          </label>
          <label>
            <input
              type="radio"
              name="estado"
              value="cerrado"
              checked={status === "cerrado"}
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
            {opinions.map((opinion, index) => (
              <tr
                key={opinion.opinion_ID}
                onClick={() => handleSelectOpinion(opinion)}
                className={
                  selectedOpinion?.opinion_ID === opinion.opinion_ID
                    ? styles.selectedRow
                    : ""
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
