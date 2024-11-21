"use client"; // Este código se ejecuta en el cliente
import styles from "./login.module.css"; // Importamos los estilos desde el archivo CSS
import React, { useState, useEffect } from "react"; // Importamos React, useState y useEffect
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar la redirección

export default function Login() {
  const [username, setUsername] = useState<string>(""); // Estado para almacenar el nombre de usuario
  const [password, setPassword] = useState<string>(""); // Estado para almacenar la contraseña
  const [message, setMessage] = useState<string | null>(null); // Estado para almacenar el mensaje (puede ser error o éxito)
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Estado para controlar si el mensaje es de éxito o error
  const router = useRouter(); // Hook para manejar la redirección

  // Inicializar `userID` y `variableModulo` en localStorage al cargar la página
  useEffect(() => {
    localStorage.setItem("userID", "0"); // Inicializa userID en "0"
    localStorage.setItem("variableModulo", "0"); // Inicializa variableModulo en "0"
    console.log("Inicializando userID y variableModulo en localStorage."); // Log para confirmar la inicialización
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Función que maneja el envío del formulario de inicio de sesión
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evitamos que la página se recargue cuando se envía el formulario

    try {
      // Enviamos una solicitud a la API para validar el usuario y contraseña
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Enviamos el nombre de usuario y la contraseña al backend
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Almacenamos el userID en localStorage para usarlo en otras partes de la aplicación
        localStorage.setItem("userID", data.userID); // Guardamos el userID en localStorage
        localStorage.setItem("variableModulo", "0"); // Reiniciamos variableModulo a "0" para futuros accesos

        setMessage("Acceso concedido"); // Mostramos el mensaje de éxito
        setIsSuccess(true); // Indicamos que el mensaje es de éxito
        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/menu"); // Redirigimos al módulo de menú si es admin
          } else {
            router.push("/opinion"); // Redirigimos al módulo de opinión si es un usuario regular
          }
        }, 2000); // Esperamos 2 segundos antes de redirigir
      } else {
        setMessage(data.message || "Credenciales incorrectas"); // Mostramos el mensaje de error si las credenciales son incorrectas
        setIsSuccess(false); // Indicamos que el mensaje es de error
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor"); // Mostramos un mensaje de error si hay problemas de conexión
      setIsSuccess(false);
    }
  };

  return (
    <main className={styles.main}> {/* Contenedor principal */}
      <div className={styles.logoContainer}>
        <img src="/images/logo.jpg" alt="Logo de la escuela" className={styles.logo} /> {/* Logo de la escuela */}
      </div>

      <div className={styles.headerText}>
        <h1>Opinion Website</h1>
        <h2>Escuela Presbítero Venancio de Oña y Martínez</h2>
      </div>

      <div className={styles.loginContainer}> {/* Contenedor del formulario */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Ingrese aquí el usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingrese aquí la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          {/* Mensaje de éxito o error */}
          {message && (
            <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
              {message}
            </p>
          )}
          
          <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
        </form>
      </div>
    </main>
  );
}
