"use client"; // Indicamos que este archivo se ejecuta en el lado del cliente (navegador).

import styles from "./gestionOpinion.module.css"; // Importa los estilos específicos.
import React, { useState, useEffect } from "react"; // Importa React y los hooks para manejar el estado.
import { useRouter } from "next/navigation"; // Importa `useRouter` para manejar la navegación.

// Definimos la estructura del objeto de Opinión.
interface Opinion {
  opinion_ID: number; // ID de la opinión.
  opinion_TypeID: number; // Tipo de la opinión (queja o sugerencia).
  opinion_type: string; // Tipo de la opinión (Queja o Sugerencia).
  description: string; // Descripción de la opinión.
  comment_ID?: number; // ID del comentario asociado, si existe.
  comment: string; // Comentario adicional sobre la opinión.
  estado: string; // Estado de la opinión (Abierto o Cerrado).
  nombre: string; // Nombre del usuario.
  apellido: string; // Apellido del usuario.
  cedula: string; // Cédula del usuario.
  fecha_registro: string; // Fecha de registro de la opinión.
}

export default function GestionOpiniones() {
  const [opinions, setOpinions] = useState<Opinion[]>([]); // Almacena las opiniones obtenidas.
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar mientras se obtienen los datos.
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null); // Opinión seleccionada por el usuario.
  const [comment, setComment] = useState<string>(""); // Comentario de la opinión seleccionada.
  const [status, setStatus] = useState<string>("Abierto"); // Estado de la opinión seleccionada (abierto o cerrado).
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación.
  const itemsPerPage = 10; // Número de opiniones por página.
  const router = useRouter(); // Instancia del router para manejar la navegación.

  // Validar userID y variableModulo al cargar la página.
  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Obtiene el userID desde localStorage.
    const variableModulo = localStorage.getItem("variableModulo"); // Obtiene variableModulo desde localStorage.

    console.log("userID:", userID); // Depuración: muestra el userID en la consola.
    console.log("variableModulo:", variableModulo); // Depuración: muestra variableModulo en la consola.

    if (!userID || userID === "0") {
      // Si no hay userID o es igual a "0", redirige a "Por favor inicie sesión".
      router.push("/please-login");
      return;
    }

    if (variableModulo === "1") {
      // Si variableModulo es igual a "1", redirige a "Acceso Prohibido".
      router.push("/access-denied");
      return;
    }
  }, []); // Este efecto se ejecuta una vez al montar el componente.

  // Función para obtener las opiniones desde la API.
  const fetchOpinions = async () => {
    try {
      setLoading(true); // Activar indicador de carga.
      const response = await fetch("/api/manageopinion", {
        method: "GET", // Solicitud GET para obtener las opiniones.
        cache: "no-store", // Asegura que los datos no se cacheen.
      });

      if (!response.ok) throw new Error("Error al obtener las opiniones");

      const data = await response.json(); // Convertir la respuesta en JSON.
      const uniqueOpinions = data.opinions.reduce((acc: Opinion[], opinion: Opinion) => {
        // Asegura que solo se muestre el último comentario por cada opinión.
        const existingIndex = acc.findIndex((o) => o.opinion_ID === opinion.opinion_ID);
        if (existingIndex === -1) {
          acc.push(opinion);
        } else {
          acc[existingIndex] = opinion; // Reemplaza la opinión existente con la más reciente.
        }
        return acc;
      }, []);
      setOpinions(uniqueOpinions); // Actualiza el estado con las opiniones únicas.
    } catch (error) {
      console.error("Error al obtener las opiniones:", error);
    } finally {
      setLoading(false); // Desactiva el indicador de carga.
    }
  };

  // Función para manejar el clic en el botón "Salir".
  const handleLogout = () => {
    if (window.confirm("¿Está seguro de que quiere salir?")) {
      // Reinicia las variables en localStorage.
      localStorage.setItem("userID", "0");
      localStorage.setItem("variableModulo", "0");

      // Redirige a la página de inicio de sesión.
      router.push("/login");
    }
  };

  // Resto del código original del archivo permanece igual.

  useEffect(() => {
    fetchOpinions(); // Llama a la función para obtener opiniones al montar el componente.
  }, []);

  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion); // Establece la opinión seleccionada.
    setComment(opinion.comment || ""); // Establece el comentario de la opinión seleccionada.
    setStatus(opinion.estado); // Establece el estado de la opinión seleccionada.
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Actualiza el estado del comentario.
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value); // Actualiza el estado con el valor seleccionado.
  };

  const handleSave = async () => {
    if (selectedOpinion) {
      try {
        const response = await fetch("/api/manageopinion", {
          method: "PUT", // Solicitud PUT para actualizar la opinión existente.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opinion_ID: selectedOpinion.opinion_ID,
            comment_ID: selectedOpinion.comment_ID || null, // Usar el comment_ID para actualizar si ya existe.
            comment,
            status,
          }),
        });

        if (response.ok) {
          alert("¡Cambios realizados con éxito!");
          const updatedOpinions = opinions.map((opinion) =>
            opinion.opinion_ID === selectedOpinion.opinion_ID
              ? { ...opinion, comment, estado: status }
              : opinion
          );
          setOpinions(updatedOpinions); // Actualiza el estado con la opinión modificada.
          handleClear();
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

  const handleClear = () => {
    setSelectedOpinion(null); // Limpia la opinión seleccionada.
    setComment(""); // Limpia el campo de comentario.
    setStatus("Abierto"); // Restablece el estado al valor predeterminado.
  };

  const paginatedOpinions = opinions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>Gestión de Opiniones</h1>

      {loading ? (
        <p className={styles.loadingText}>Cargando opiniones...</p>
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
                    className={
                      selectedOpinion?.opinion_ID === opinion.opinion_ID
                        ? styles.selectedRow
                        : ""
                    }
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{opinion.opinion_type}</td>
                    <td>{opinion.description}</td>
                    <td>{opinion.nombre}</td>
                    <td>{opinion.apellido}</td>
                    <td>{opinion.cedula}</td>
                    <td>
                      {opinion.fecha_registro
                        ? new Date(opinion.fecha_registro).toLocaleDateString("es-ES")
                        : ""}
                    </td>
                    <td>{opinion.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.pageButton}>
              Actualizar
            </button>
            <button
              onClick={() => router.push("/menu")}
              className={styles.pageButton}
            >
              Menú
            </button>
            <button onClick={handleClear} className={styles.pageButton}>
              Limpiar
            </button>
            <button onClick={handleLogout} className={styles.pageButton}>
              Salir
            </button>
          </div>

          <div className={styles.pagination}>
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className={styles.pageButton}
              >
                Anterior
              </button>
            )}
            {opinions.length > currentPage * itemsPerPage && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className={styles.pageButton}
              >
                Siguiente
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
