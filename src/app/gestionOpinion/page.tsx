"use client"; // Indicamos que este archivo se ejecuta en el cliente

import styles from "./gestionOpinion.module.css"; // Importamos los estilos específicos para este módulo
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones en Next.js

// Definimos la estructura de datos para las opiniones
interface Opinion {
  opinion_ID: number; // Cambiado a `number` para ser consistente
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
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Estado para la opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado para manejar el comentario de la opinión seleccionada
  const [status, setStatus] = useState<string>("Abierto"); // Estado para manejar el estado de la opinión seleccionada
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la tabla
  const itemsPerPage = 10; // Número de opiniones por página
  const router = useRouter(); // Instancia de router para manejar redirecciones

  useEffect(() => {
    fetchOpinions(); // Llamamos a la función que obtiene las opiniones
  }, []);

  // Función para obtener las opiniones desde la API
  const fetchOpinions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/manageopinion");
      if (!response.ok) throw new Error("Error al obtener las opiniones");

      const data = await response.json();
      setOpinions(data.opinions);
    } catch (error) {
      console.error("Error al obtener las opiniones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la selección de una opinión al hacer clic en una fila
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion);
    setComment(opinion.comment || "");
    setStatus(opinion.estado);
  };

  // Función para manejar el cambio en el campo de comentario
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // Función para manejar el cambio en los radio buttons de estado
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
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
            opinion_ID: selectedOpinion.opinion_ID,
            comment,
            status: status === "Abierto" ? "Abierto" : "Cerrado",
          }),
        });

        if (response.ok) {
          alert("¡Cambios realizados con éxito!");
          fetchOpinions(); // Recargar opiniones después de actualizar
          handleClear(); // Limpiar selección
        } else {
          alert("Error al actualizar la información.");
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  // Función para limpiar los campos y la selección
  const handleClear = () => {
    setSelectedOpinion(null);
    setComment("");
    setStatus("Abierto");
  };

  // Paginación de las opiniones
  const paginatedOpinions = opinions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // Asegurarse de que las filas vacías también tengan `opinion_ID` como un número
  const filledOpinions: Opinion[] = [
    ...paginatedOpinions,
    ...Array.from({ length: itemsPerPage - paginatedOpinions.length }, (_, index) => ({
      opinion_ID: -(index + 1), // Usar valores negativos para IDs de filas vacías
      opinion_TypeID: 0,
      opinion_type: "",
      description: "",
      comment: "",
      estado: "",
      nombre: "",
      apellido: "",
      cedula: "",
      fecha_registro: "",
    }))
  ];

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>Gestión de Opiniones</h1>

      {/* Formulario para ver y editar los detalles de la opinión */}
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

      {/* Sección de estado con botones de radio */}
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

      {/* Tabla de opiniones */}
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
            {filledOpinions.map((opinion, index) => (
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

      {/* Botones de acción */}
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

      {/* Botones de paginación */}
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
    </main>
  );
}
