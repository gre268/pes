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
      {/* Mover el logo justo encima del título "Opinion Website" */}
      <div className={styles.logoContainer}>
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
            placeholder="Ingrese aquí el usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input} // Estilo aplicado al campo de texto
          />

          <label htmlFor="password">Contraseña</label> {/* Etiqueta para el campo de contraseña */}
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
          
          <button type="submit" className={styles.submitButton}>Iniciar Sesión</button> {/* Botón de enviar */}
        </form>
      </div>
    </main>
  );
}
