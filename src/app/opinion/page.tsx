"use client"; // Indicamos que este código se ejecuta en el cliente (del lado del usuario)
import styles from "./page.module.css"; // Importamos los estilos desde el archivo CSS
import React, { useState } from "react"; // Importamos React y el hook useState para manejar el estado de los componentes
import { useRouter } from "next/navigation"; // Importamos useRouter para redirigir al login

export default function Opinion() {
  const [details, setDetails] = useState<string>(""); // Estado para almacenar el texto ingresado en el área de detalle
  const [type, setType] = useState<string>("queja"); // Estado para almacenar si es "Queja" o "Sugerencia"
  const [message, setMessage] = useState<string>(""); // Estado para almacenar y mostrar mensajes de éxito o error
  const [charCount, setCharCount] = useState<number>(200); // Estado para el contador de caracteres restantes
  const router = useRouter(); // Hook que permite manejar la navegación y redirecciones en la página

  // Función que se ejecuta cuando el formulario se envía
  const handleSubmit = async (event: React.FormEvent) => { 
    event.preventDefault(); // Evitamos que la página se recargue al enviar el formulario

    try {
      // Enviamos los datos ingresados al backend (aún no conectado a la base de datos)
      const response = await fetch("/api", { 
        body: JSON.stringify({
          createdDate: new Date(), // Se guarda la fecha actual
          details, // Detalle de la queja o sugerencia
          type, // Tipo de opinión (queja o sugerencia)
          user: 0, // Aquí se podría agregar el ID de usuario cuando esté conectado a la base de datos
        }),
        method: "POST", 
        headers: {
          "Content-Type": "application/json", // Indicamos que estamos enviando datos en formato JSON
        },
      });

      // Si la respuesta del servidor es correcta
      if (response.ok) {
        setMessage("¡Opinión guardada exitosamente!"); // Mostramos un mensaje de éxito
        setDetails(""); // Limpiamos el campo de detalle
        setType("queja"); // Reiniciamos el tipo de opinión a "queja"
        setCharCount(200); // Reiniciamos el contador de caracteres a 200
      } else {
        setMessage("Ocurrió un error al guardar la opinión."); // Mostramos un mensaje de error en caso de fallo
      }
    } catch (error) {
      setMessage("Error al conectarse al servidor."); // Mostramos un mensaje de error en caso de problemas con la conexión
    }
  };

  // Función para manejar los cambios en el campo de detalle
  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= 200) { // Verificamos que no exceda los 200 caracteres
      setDetails(text); // Actualizamos el estado del detalle
      setCharCount(200 - text.length); // Actualizamos el contador de caracteres restantes
    }
  };

  // Función que se ejecuta cuando el usuario hace clic en el botón "Salir"
  const handleLogout = () => {
    alert("Muchas gracias por utilizar el sitio web Opinion Website"); // Mostramos el mensaje de agradecimiento al usuario
    router.push("/login"); // Redirigimos al módulo de login
  };

  return (
    <main className={styles.main}> {/* Contenedor principal de la página */}
      <div className={styles.headerText}> {/* Contenedor de los textos del encabezado */}
        <h1>Opinion Website</h1> {/* Título principal */}
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2> {/* Subtítulo */}
      </div>

      <div className={styles.square}> {/* Contenedor del formulario */}
        {/* Si hay un mensaje de éxito o error, lo mostramos aquí */}
        {message && <p className={styles.message}>{message}</p>} {/* Mostramos el mensaje según el estado */}

        {/* Formulario para ingresar los detalles de la opinión */}
        <form id="form" onSubmit={handleSubmit}> {/* Al enviar el formulario se ejecuta handleSubmit */}
          <textarea
            className={styles.description} // Aplicamos los estilos al área de texto
            name="detalle" // Nombre del campo
            placeholder="Por favor ingrese aquí el detalle" // Texto de ayuda en el área de texto
            value={details} // Asociamos el valor ingresado al estado "details"
            onChange={handleDetailsChange} // Maneja el cambio del texto en el campo de detalles
            maxLength={200} // Establece el límite máximo de caracteres
          />
          {/* Contador de caracteres con clase específica */}
          <p className={styles.charCounter}>{charCount} caracteres restantes</p> {/* Mostramos los caracteres restantes */}
          {charCount === 0 && <p className={styles.limitMessage}>Límite de texto alcanzado</p>} {/* Mostramos mensaje si se alcanza el límite de caracteres */}

          {/* Opciones para seleccionar "Queja" o "Sugerencia" */}
          <div className={styles.radioContainer}>
            <label>
              <input
                type="radio" // Tipo de botón de opción
                name="opinionType" // Nombre del grupo de botones
                value="queja" // Valor de esta opción
                checked={type === "queja"} // Verificamos si la opción seleccionada es "queja"
                onChange={() => setType("queja")} // Actualizamos el estado a "queja" cuando se selecciona
              />
              Queja
            </label>
            <label>
              <input
                type="radio" // Tipo de botón de opción
                name="opinionType" // Nombre del grupo de botones
                value="sugerencia" // Valor de esta opción
                checked={type === "sugerencia"} // Verificamos si la opción seleccionada es "sugerencia"
                onChange={() => setType("sugerencia")} // Actualizamos el estado a "sugerencia" cuando se selecciona
              />
              Sugerencia
            </label>
          </div>

          {/* Botones para enviar la opinión o salir */}
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={charCount < 0}>Enviar</button> {/* Botón de enviar */}
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>Salir</button> {/* Botón de salir */}
          </div>
        </form>
      </div>
    </main>
  );
}
