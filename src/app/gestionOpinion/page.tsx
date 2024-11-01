"use client"; // Ejecuta este archivo en el cliente
import styles from "./gestionOpinion.module.css"; // Importa los estilos específicos para este módulo
import React, { useState, useEffect } from "react"; // Importa React y hooks
import { useRouter } from "next/navigation"; // Importa useRouter para redirecciones

// Define la estructura de datos para las opiniones
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
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Estado para almacenar las opiniones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [loadStatus, setLoadStatus] = useState<string>(""); // Estado del mensaje de carga
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Opinión seleccionada
  const [comment, setComment] = useState<string>(""); // Estado del comentario
  const [status, setStatus] = useState<string>("Abierto"); // Estado del estado de la opinión
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la lista
  const itemsPerPage = 5; // Elementos por página
  const router = useRouter(); // Para redirecciones

  // useEffect para cargar las opiniones desde la API al montar el componente
  useEffect(() => {
    fetchOpinions(); // Llama a la función para obtener opiniones
  }, []);

  // Función para obtener opiniones desde la API
  const fetchOpinions = async () => {
    try {
      setLoading(true); // Muestra pantalla de carga
      setLoadStatus("Cargando opiniones..."); // Mensaje de carga
      const response = await fetch("/api/gestionOpinion"); // Llama a la API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido"); // Lanza error si falla la carga
      }
      const data = await response.json();
      setOpinions(data.opinions); // Almacena las opiniones obtenidas
      setLoadStatus("Opiniones cargadas exitosamente."); // Mensaje de éxito
    } catch (error: any) {
      console.error("Error al obtener las opiniones:", error.message); // Log del error
      setLoadStatus(`Error al cargar opiniones: ${error.message}`); // Mensaje de error
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  // Función para manejar la selección de una opinión
  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Establece la opinión seleccionada
    setComment(opinion.comment || ""); // Establece el comentario
    setStatus(opinion.status === "Abierto" ? "Abierto" : "Cerrado"); // Establece el estado
  };

  // Función para manejar el cambio en el campo de comentario
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualiza el comentario
  };

  // Función para manejar el cambio en los radio buttons de estado
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualiza el estado
  };

  // Función para guardar los cambios en el comentario y el estado de la opinión
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
            status: status === "Abierto" ? "Abierto" : "Cerrado",
          }),
        });

        if (response.ok) {
          alert("Información actualizada con éxito.");
          const updatedOpinions = opinions.map((op) =>
            op.opinion_ID === selectedOpinion.opinion_ID
              ? { ...op, comment, status }
              : op
          );
          setOpinions(updatedOpinions); // Actualiza la lista local de opiniones
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar:", errorData.message);
          alert(`Error al actualizar: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error al guardar cambios:", error);
      }
    }
  };

  // Calcular las opiniones para la página actual
  const indexOfLastOpinion = currentPage * itemsPerPage;
  const indexOfFirstOpinion = indexOfLastOpinion - itemsPerPage;
  const currentOpinions = opinions.slice(indexOfFirstOpinion, indexOfLastOpinion);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(opinions.length / itemsPerPage);

  // Cambiar página
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className={styles.main}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>{loadStatus}</p>
        </div>
      ) : (
        <>
          <div className={styles.headerText}>
            <h1>Opiniones</h1>
          </div>

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

          <div className={styles.listContainer}>
            {currentOpinions.map((opinion, index) => (
              <div
                key={opinion.opinion_ID}
                onClick={() => handleSelectOpinion(opinion)}
                className={
                  selectedOpinion?.opinion_ID === opinion.opinion_ID
                    ? styles.selectedItem
                    : styles.listItem
                }
              >
                <h4>{index + 1 + (currentPage - 1) * itemsPerPage}. {opinion.opinion_TypeID === 1 ? "Queja" : "Sugerencia"}</h4>
                <p><strong>Descripción:</strong> {opinion.description}</p>
                <p><strong>Nombre:</strong> {opinion.name} {opinion.lastName1}</p>
                <p><strong>Cédula:</strong> {opinion.cedula}</p>
                <p><strong>Fecha de Registro:</strong> {new Date(opinion.created_At).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {opinion.status}</p>
              </div>
            ))}
          </div>

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
        </>
      )}
    </main>
  );
}
