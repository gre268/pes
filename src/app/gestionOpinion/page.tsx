"use client";

import styles from "./gestionOpinion.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState<string>("");
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<string>("Abierto");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchOpinions();
  }, []);

  const fetchOpinions = async () => {
    try {
      setLoading(true);
      setLoadStatus("Cargando opiniones...");
      const response = await fetch("/api/gestionOpinion");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido al obtener las opiniones");
      }

      const data = await response.json();
      setOpinions(data.opinions);
      setLoadStatus("Opiniones cargadas exitosamente.");
    } catch (error: any) {
      console.error("Error al obtener las opiniones:", error.message);
      setLoadStatus(`Error al cargar opiniones: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOpinion = (opinion: Opinion) => {
    setSelectedOpinion(opinion);
    setComment(opinion.comment || "");
    setStatus(opinion.status === "Abierto" ? "Abierto" : "Cerrado");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

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
          setSelectedOpinion({ ...selectedOpinion, comment, status });
          const updatedOpinions = opinions.map((op) =>
            op.opinion_ID === selectedOpinion.opinion_ID ? { ...op, comment, status } : op
          );
          setOpinions(updatedOpinions);
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la información:", errorData.message);
          alert(`Error al actualizar la información: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastOpinion = currentPage * itemsPerPage;
  const indexOfFirstOpinion = indexOfLastOpinion - itemsPerPage;
  const currentOpinions = opinions.slice(indexOfFirstOpinion, indexOfLastOpinion);

  const totalPages = Math.ceil(opinions.length / itemsPerPage);

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
                {currentOpinions.map((opinion, index) => (
                  <tr
                    key={opinion.opinion_ID}
                    onClick={() => handleSelectOpinion(opinion)}
                    className={
                      selectedOpinion?.opinion_ID === opinion.opinion_ID ? styles.selectedRow : ""
                    }
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
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
