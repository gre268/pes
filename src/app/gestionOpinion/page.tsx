"use client"; // Indicamos que este archivo se ejecuta en el cliente

import styles from "./gestionOpinion.module.css"; // Importamos los estilos CSS específicos para este módulo
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones en Next.js

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
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones obtenidas desde la API
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario de la opinión seleccionada
  const [status, setStatus] = useState<string>("Abierto"); // Estado para manejar el estado de la opinión seleccionada
  const router = useRouter(); // Instancia de router para manejar redirecciones

  // useEffect para cargar las opiniones desde la API al montar el componente
  useEffect(() => {
    fetchOpinions(); // Llamamos a la función que obtiene las opiniones
  }, []);

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      const response = await fetch("/api/gestionOpinion"); // Llamada a la API para obtener opiniones
      if (!response.ok) throw new Error("Error al obtener las opiniones");
      
      const data = await response.json();
      setOpinions(data.opinions); // Almacena las opiniones obtenidas en el estado
    } catch (error) {
      console.error("Error al obtener las opiniones:", error);
    }
  };

  // Función para manejar la selección de una opinión al hacer clic en una fila
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Guarda la opinión seleccionada en el estado
    setComment(opinion.comment || ""); // Carga el comentario actual de la opinión o vacío si no existe
    setStatus(opinion.estado === "Abierto" ? "Abierto" : "Cerrado"); // Establece el estado actual de la opinión
  };

  // Función para guardar los cambios en el comentario y el estado de la opinión seleccionada
  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch("/api/gestionOpinion", {
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
          alert("Información actualizada con éxito.");
          fetchOpinions(); // Recarga las opiniones para reflejar los cambios
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

      {/* Formulario para ver y editar los detalles de la opinión */}
      <div className={styles.opinionForm}>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={selectedOpinion?.description || ""}
          className={styles.textarea}
          readOnly
        />
        <textarea
          name="comentario"
          placeholder="Comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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
              value="Abierto"
              checked={status === "Abierto"}
              onChange={() => setStatus("Abierto")}
            />
            Abierto
          </label>
          <label>
            <input
              type="radio"
              name="estado"
              value="Cerrado"
              checked={status === "Cerrado"}
              onChange={() => setStatus("Cerrado")}
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
                className={selectedOpinion?.opinion_ID === opinion.opinion_ID ? styles.selectedRow : ""}
              >
                <td>{index + 1}</td>
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

      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
        <button onClick={() => router.push("/menu")} className={styles.menuButton}>Menú</button>
        <button onClick={() => router.push("/login")} className={styles.logoutButton}>Salir</button>
      </div>
    </main>
  );
}
