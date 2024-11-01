"use client"; // Este código se ejecuta en el cliente
import styles from "./page.module.css"; // Importamos los estilos específicos del archivo CSS
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones

export default function Opinion() {
  const [details, setDetails] = useState<string>(""); // Estado para almacenar el texto ingresado en el área de detalle
  const [type, setType] = useState<string>("queja"); // Estado para manejar el tipo de opinión (queja o sugerencia)
  const [message, setMessage] = useState<string>(""); // Estado para almacenar y mostrar mensajes de éxito o error
  const [charCount, setCharCount] = useState<number>(200); // Estado para manejar el contador de caracteres restantes
  const [currentUser, setCurrentUser] = useState<number | null>(null); // Estado para almacenar el ID del usuario actual
  const router = useRouter(); // Hook para manejar la redirección entre páginas

  // useEffect para obtener el ID del usuario actual desde localStorage
  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Obtenemos el userID desde localStorage
    if (userID) {
      setCurrentUser(parseInt(userID)); // Guardamos el userID en el estado como número
    } else {
      setMessage("Error al obtener el usuario actual.");
    }
  }, []);

  // Función que se ejecuta cuando el formulario se envía
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevenimos que la página se recargue al enviar el formulario

    // Validación de datos
    if (!details) {
      setMessage("Por favor, ingresa el detalle de la opinión.");
      return;
    }
    if (!currentUser) {
      setMessage("No se ha encontrado un usuario válido para guardar la opinión.");
      return;
    }

    try {
      const response = await fetch("/api/opinion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicamos que estamos enviando datos en formato JSON
        },
        body: JSON.stringify({
          createdDate: new Date(), // Fecha de creación de la opinión
          details, // Detalles de la opinión
          type, // Tipo de opinión (queja o sugerencia)
          userID: currentUser, // ID del usuario que envía la opinión
        }),
      });

      if (response.ok) {
        setMessage("¡Opinión guardada exitosamente!"); // Mostramos mensaje de éxito
        setDetails(""); // Limpiamos el campo de texto
        setType("queja"); // Reiniciamos el tipo de opinión a "queja"
        setCharCount(200); // Reiniciamos el contador de caracteres

        // Ocultamos el mensaje de éxito después de 3 segundos
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Ocurrió un error al guardar la opinión.");
      }
    } catch (error) {
      setMessage("Error al conectarse al servidor.");
    }
  };

  // Función que maneja los cambios en el campo de texto de detalle y actualiza el contador de caracteres
  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= 200) { // Verificamos que el texto no exceda los 200 caracteres
      setDetails(text); // Actualizamos el estado con el nuevo texto
      setCharCount(200 - text.length); // Actualizamos el contador de caracteres restantes
    }
  };

  // Función que se ejecuta al hacer clic en "Salir"
  const handleLogout = () => {
    localStorage.removeItem("userID"); // Eliminamos el userID de localStorage al cerrar sesión
    alert("Gracias por utilizar Opinion Website"); // Mostramos un mensaje de agradecimiento
    router.push("/login"); // Redirigimos al login
  };

  return (
    <main className={styles.main}> {/* Contenedor principal de la página */}
      <div className={styles.headerText}> {/* Contenedor del título y subtítulo */}
        <h1>Opinion Website</h1> {/* Título principal */}
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2> {/* Subtítulo */}
      </div>

      <div className={styles.square}> {/* Contenedor del formulario */}
        {message && <p className={styles.message}>{message}</p>} {/* Mostramos mensajes de éxito o error */}

        {/* Formulario para ingresar la opinión */}
        <form id="form" onSubmit={handleSubmit}>
          <textarea
            name="detalle"
            placeholder="Por favor ingrese aquí el detalle"
            value={details}
            onChange={handleDetailsChange} // Llamamos a handleDetailsChange en cada cambio
            maxLength={200} // Límite máximo de caracteres
            className={styles.description} // Clase para estilo del área de texto
          />
          <p className={styles.charCounter}>{charCount} caracteres restantes</p> {/* Mostramos el contador de caracteres */}
          {charCount === 0 && <p className={styles.limitMessage}>Límite de texto alcanzado</p>} {/* Mensaje al llegar al límite */}

          {/* Radio buttons para seleccionar "Queja" o "Sugerencia" */}
          <div className={styles.radioContainer}>
            <label>
              <input
                type="radio"
                name="opinionType"
                value="queja"
                checked={type === "queja"}
                onChange={() => setType("queja")}
              />
              Queja
            </label>
            <label>
              <input
                type="radio"
                name="opinionType"
                value="sugerencia"
                checked={type === "sugerencia"}
                onChange={() => setType("sugerencia")}
              />
              Sugerencia
            </label>
          </div>

          {/* Botones de enviar y salir */}
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={charCount === 0}>Enviar</button>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>Salir</button>
          </div>
        </form>
      </div>
    </main>
  );
}
