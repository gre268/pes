"use client"; // Indicamos que este código se ejecuta en el cliente
import styles from "./gestionOpinion.module.css"; // Importamos los estilos CSS específicos para este módulo
import React, { useState } from "react"; // Importamos React y el hook useState para manejar el estado
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar las redirecciones entre páginas

export default function GestionOpiniones() {
  // Estado inicial con dos opiniones por defecto para pruebas (Queja y Sugerencia)
  const [opinions, setOpinions] = useState([
    {
      descripcion: "Mi hijo se peleó con su amigo y quiero que se tomen las medidas correspondientes.", // Primera opinión (Queja)
      comentario: "",
      estado: "Abierto",
      nombre: "Juan",
      fecha: "10/20/2024",
    },
    {
      descripcion: "Hacer una rifa para recaudar fondos para la escuela.", // Segunda opinión (Sugerencia)
      comentario: "",
      estado: "Abierto",
      nombre: "María",
      fecha: "10/22/2024",
    },
  ]);

  // Estado inicial para manejar los datos del formulario de opinión
  const [opinionData, setOpinionData] = useState({
    descripcion: "",      // Campo para la descripción de la opinión (no editable en el futuro)
    comentario: "",       // Campo para el comentario (editable)
    estado: "abierto",    // Estado de la opinión (por defecto "abierto")
  });

  // Hook para manejar las redirecciones entre páginas
  const router = useRouter(); 

  // Función para manejar los cambios en los campos de texto y radio buttons
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setOpinionData({ ...opinionData, [name]: value }); // Actualizamos el estado con los valores modificados
  };

  // Función para cargar los datos de la opinión seleccionada al hacer clic en una fila de la tabla
  const handleEdit = (opinion) => {
    setOpinionData({
      descripcion: opinion.descripcion,   // Cargamos la descripción (no editable)
      comentario: opinion.comentario,     // Cargamos el comentario (editable)
      estado: opinion.estado.toLowerCase() === "abierto" ? "abierto" : "cerrado", // Cargamos el estado
    });
  };

  // Función para actualizar los cambios en el comentario y el estado de la opinión
  const handleSave = () => {
    const updatedOpinions = opinions.map((op) =>
      op.descripcion === opinionData.descripcion
        ? { ...op, comentario: opinionData.comentario, estado: opinionData.estado === "abierto" ? "Abierto" : "Cerrado" }
        : op
    );
    setOpinions(updatedOpinions); // Actualizamos la lista de opiniones con los cambios
    alert("¡Opinión Actualizada!"); // Mostramos el mensaje de confirmación
  };

  // Función para redirigir al menú principal
  const handleMenu = () => {
    router.push("/menu"); // Redirigimos al módulo de menú
  };

  // Función para redirigir al login y mostrar un mensaje de salida
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema"); // Mostramos un mensaje de despedida
    router.push("/login"); // Redirigimos al módulo de login después del mensaje
  };

  return (
    <main className={styles.main}> {/* Contenedor principal */}
      <div className={styles.headerText}> {/* Título de la página */}
        <h1>Opiniones</h1> {/* Título "Opiniones" */}
      </div>

      {/* Formulario para ingresar la descripción de la opinión y el comentario */}
      <div className={styles.opinionForm}>
        <textarea
          name="descripcion"
          placeholder="Descripción" // Placeholder dentro del campo de texto
          value={opinionData.descripcion} // Valor actual de la descripción
          className={styles.textarea}
          readOnly={true} // Deshabilitamos la edición de este campo (será obtenido desde la base de datos)
        />
        <textarea
          name="comentario"
          placeholder="Comentario" // Placeholder dentro del campo de texto
          value={opinionData.comentario} // Valor actual del comentario
          onChange={handleChange} // Manejador para actualizar el estado al escribir
          className={styles.textarea}
        />
      </div>

      {/* Título "Estado" y radio buttons para seleccionar el estado de la opinión (Abierto o Cerrado) */}
      <div className={styles.estadoContainer}>
        <h3>Estado</h3> {/* Agregamos la palabra "Estado" como título */}
        <div className={styles.radioContainer}>
          <label>
            <input
              type="radio"
              name="estado"
              value="abierto"
              checked={opinionData.estado === "abierto"} // Verificamos si el estado seleccionado es "abierto"
              onChange={handleChange} // Actualizamos el estado cuando se selecciona
            />
            Abierto
          </label>
          <label>
            <input
              type="radio"
              name="estado"
              value="cerrado"
              checked={opinionData.estado === "cerrado"} // Verificamos si el estado seleccionado es "cerrado"
              onChange={handleChange} // Actualizamos el estado cuando se selecciona
            />
            Cerrado
          </label>
        </div>
      </div>

      {/* Tabla para mostrar las opiniones registradas */}
      <div className={styles.tableContainer}>
        <table className={styles.opinionTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Opinión</th>
              <th>Descripción</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {opinions.map((opinion, index) => (
              <tr key={index} onClick={() => handleEdit(opinion)}> {/* Al hacer clic en una fila, cargamos la opinión seleccionada */}
                <td>{index + 1}</td> {/* Número de opinión */}
                <td>{index === 0 ? "Queja" : "Sugerencia"}</td> {/* Tipo de opinión: Queja o Sugerencia */}
                <td>{opinion.descripcion}</td> {/* Descripción */}
                <td>{opinion.nombre}</td> {/* Nombre del usuario */}
                <td>{opinion.fecha}</td> {/* Fecha */}
                <td>{opinion.estado}</td> {/* Estado (Abierto/Cerrado) */}
              </tr>
            ))}
            {/* Agregamos campos vacíos por defecto si no hay suficientes opiniones */}
            {Array.from({ length: 10 - opinions.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td colSpan={6}>&nbsp;</td> {/* Rellenamos las celdas vacías */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de acciones (Guardar, Menú, Salir) */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Guardar</button> {/* Botón para guardar los cambios */}
        <button onClick={handleMenu} className={styles.menuButton}>Menú</button> {/* Botón para redirigir al menú */}
        <button onClick={handleLogout} className={styles.logoutButton}>Salir</button> {/* Botón para redirigir al login */}
      </div>
    </main>
  );
}
