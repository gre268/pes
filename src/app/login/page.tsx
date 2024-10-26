"use client"; // Indicamos que este código se ejecuta en el cliente
import styles from "./login.module.css"; // Importamos los estilos desde el archivo CSS
import React, { useState } from "react"; // Importamos React y el hook useState para manejar el estado
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar la redirección

export default function Login() {
  const [username, setUsername] = useState<string>(""); // Estado para almacenar el nombre de usuario
  const [password, setPassword] = useState<string>(""); // Estado para almacenar la contraseña
  const [message, setMessage] = useState<string | null>(null); // Estado para almacenar el mensaje (puede ser error o éxito)
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Estado para controlar si el mensaje es de éxito o error
  const router = useRouter(); // Hook para manejar la redirección

  // Función que maneja el envío del formulario de inicio de sesión
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Evitamos que la página se recargue cuando se envía el formulario

    // Validación de credenciales con usuario regular y admin
    if (username === "usuario1" && password === "123") { 
      setMessage("Acceso concedido"); // Mostramos el mensaje de éxito
      setIsSuccess(true); // Indicamos que el mensaje es de éxito
      setTimeout(() => {
        router.push("/opinion"); // Redirigimos al Módulo de Opinión después de 2 segundos
      }, 2000); // Esperamos 2 segundos antes de redirigir
    } else if (username === "admin1" && password === "123") { 
      setMessage("Acceso concedido"); // Mostramos el mensaje de éxito
      setIsSuccess(true); // Indicamos que el mensaje es de éxito
      setTimeout(() => {
        router.push("/menu"); // Redirigimos al Módulo de Menú (para admins) después de 2 segundos
      }, 2000); // Esperamos 2 segundos antes de redirigir
    } else {
      setMessage("Credenciales incorrectos, intente de nuevo"); // Mostramos el mensaje de error
      setIsSuccess(false); // Indicamos que el mensaje es de error
    }
  };

  return (
    <main className={styles.main}> {/* Contenedor principal */}
      <div className={styles.logoContainer}> {/* Contenedor para el logo */}
        <img src="/images/logo.jpg" alt="Logo de la escuela" className={styles.logo} /> {/* Logo de la escuela */}
      </div>

      {/* Títulos de la página */}
      <div className={styles.headerText}>
        <h1>Opinion Website</h1>
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2>
      </div>

      <div className={styles.loginContainer}> {/* Contenedor del formulario */}
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label> {/* Etiqueta para el campo de nombre de usuario */}
          <input
            type="text"
            id="username"
            placeholder="Ingrese aquí el usuario" // Placeholder dentro del input
            value={username} // Asociamos el valor ingresado al estado "username"
            onChange={(e) => setUsername(e.target.value)} // Actualizamos el estado "username" cuando el usuario escribe
            required
            className={styles.input} // Estilo aplicado al campo de texto
          />
          
          <label htmlFor="password">Contraseña</label> {/* Etiqueta para el campo de contraseña */}
          <input
            type="password"
            id="password"
            placeholder="Ingrese aquí la contraseña" // Placeholder dentro del input
            value={password} // Asociamos el valor ingresado al estado "password"
            onChange={(e) => setPassword(e.target.value)} // Actualizamos el estado "password" cuando el usuario escribe
            required
            className={styles.input} // Estilo aplicado al campo de texto
          />

          {/* Mensaje de éxito o error */}
          {message && (
            <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
              {message}
            </p>
          )}
          
          <button type="submit" className={styles.submitButton}>Iniciar Sesión</button> {/* Botón de enviar */}
        </form>
      </div>
    </main>
  );
}
