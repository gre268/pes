"use client"; // Este código se ejecuta en el cliente (lado del usuario)
import styles from "./page.module.css"; // Importamos los estilos del archivo CSS correspondiente
import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones

export default function Opinion() {
  const [details, setDetails] = useState<string>(""); // Estado para almacenar el texto ingresado en el área de detalle
  const [type, setType] = useState<string>("queja"); // Estado para manejar el tipo de opinión (queja o sugerencia)
  const [message, setMessage] = useState<string>(""); // Estado para almacenar y mostrar mensajes de éxito o error
  const [charCount, setCharCount] = useState<number>(200); // Estado para manejar el contador de caracteres restantes
  const [currentUser, setCurrentUser] = useState<number | null>(null); // Estado para almacenar el ID del usuario actual
  const router = useRouter(); // Hook para manejar la redirección entre páginas

  // useEffect para obtener el ID del usuario actual (simulación de autenticación)
  useEffect(() => {
    // Simulación para obtener el ID del usuario actual (puedes reemplazar con tu lógica de autenticación)
    const getUser = async () => {
      try {
        const response = await fetch("/api/auth/user"); // Supongamos que tienes una API para obtener el usuario actual
        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.userID); // Establecemos el ID del usuario actual en el estado
        } else {
          setMessage("Error al obtener el usuario actual.");
        }
      } catch (error) {
        setMessage("Error al conectarse con el servidor para obtener el usuario.");
      }
    };
    getUser();
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
      // Enviamos los datos de la nueva opinión al backend
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

      // Si la respuesta es correcta
      if (response.ok) {
        setMessage("¡Opinión guardada exitosamente!"); // Mostramos mensaje de éxito
        setDetails(""); // Limpiamos el campo de texto
        setType("queja"); // Reiniciamos el tipo de opinión a "queja"
        setCharCount(200); // Reiniciamos el contador de caracteres
      } else {
        setMessage("Ocurrió un error al guardar la opinión."); // Mensaje de error en caso de fallo
      }
    } catch (error) {
      setMessage("Error al conectarse al servidor."); // Mensaje de error de conexión
    }
  };

  // Función que maneja los cambios en el campo de texto de detalle
  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= 200) { // Verificamos que el texto no exceda los 200 caracteres
      setDetails(text); // Actualizamos el estado con el nuevo texto
      setCharCount(200 - text.length); // Actualizamos el contador de caracteres restantes
    }
  };

  // Función que se ejecuta al hacer clic en "Salir"
  const handleLogout = () => {
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
            className={styles.description}
            name="detalle"
            placeholder="Por favor ingrese aquí el detalle"
            value={details}
            onChange={handleDetailsChange}
            maxLength={200} // Límite máximo de caracteres
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
            <button type="submit" className={styles.submitButton} disabled={charCount < 0}>Enviar</button>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>Salir</button>
          </div>
        </form>
      </div>
    </main>
  );
}
