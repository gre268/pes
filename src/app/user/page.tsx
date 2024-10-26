"use client"; // Indicamos que este código se ejecuta en el cliente (renderizado en el navegador)
import styles from "./user.module.css"; // Importamos los estilos CSS específicos para este módulo
import React, { useState } from "react"; // Importamos React y el hook useState para manejar el estado
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar las redirecciones entre páginas

export default function AdministrarUsuarios() {
  // Estado inicial para manejar los datos del formulario de usuario
  const [formData, setFormData] = useState({
    username: "",         // Campo de nombre de usuario
    password: "",         // Campo de contraseña (visible)
    nombre: "",           // Campo del nombre del usuario
    primerApellido: "",   // Campo del primer apellido
    segundoApellido: "",  // Campo del segundo apellido
    correo: "",           // Campo del correo electrónico
    telefono: "",         // Campo del número de teléfono
    cedula: "",           // Campo del número de cédula
    tipo: "regular",      // Tipo de usuario (por defecto regular)
  });

  // Estado para manejar la lista de usuarios registrados
  const [users, setUsers] = useState([]); 

  // Estado para manejar la página actual en la tabla (paginación)
  const [currentPage, setCurrentPage] = useState(1); 

  // Definimos el número de usuarios que se mostrarán por página
  const itemsPerPage = 10; 

  // Hook para manejar las redirecciones entre páginas
  const router = useRouter(); 

  // Función para manejar los cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Capturamos el nombre y valor del campo que se está modificando
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado con los datos del formulario
  };

  // Función para guardar los datos del usuario (crear o actualizar)
  const handleSave = () => {
    // Actualizamos o creamos un usuario
    const updatedUsers = users.map((user) =>
      user.username === formData.username
        ? { ...user, ...formData } // Si el usuario existe, lo actualizamos
        : user
    );

    const isExistingUser = users.some((user) => user.username === formData.username);
    if (!isExistingUser) {
      updatedUsers.push(formData); // Si no existe, lo agregamos a la lista
    }

    setUsers(updatedUsers); // Actualizamos la lista de usuarios
    alert("Acciones Realizadas con Éxito!"); // Mostramos el mensaje de éxito
  };

  // Función para cargar los datos del usuario seleccionado al hacer clic en una fila de la tabla
  const handleEdit = (user) => {
    setFormData({
      username: user.username,         // Cargamos el nombre de usuario en el formulario
      password: user.password,         // Cargamos la contraseña en el formulario (visible)
      nombre: user.nombre,             // Cargamos el nombre en el formulario
      primerApellido: user.primerApellido, // Cargamos el primer apellido
      segundoApellido: user.segundoApellido, // Cargamos el segundo apellido
      correo: user.correo,             // Cargamos el correo en el formulario
      telefono: user.telefono,         // Cargamos el teléfono en el formulario
      cedula: user.cedula,             // Cargamos la cédula en el formulario
      tipo: user.tipo,                 // Cargamos el tipo de usuario (admin o regular)
    });
  };

  // Función para eliminar un usuario con confirmación
  const handleDelete = (username: string) => {
    const confirmDelete = confirm("Confirmar Acción: ¿Está seguro de eliminar este usuario?"); // Confirmación antes de eliminar
    if (confirmDelete) {
      setUsers(users.filter((user) => user.username !== username)); // Eliminamos el usuario si se confirma la acción
    }
  };

  // Función para redirigir al menú principal
  const handleMenu = () => {
    router.push("/menu"); // Redirigimos al usuario al módulo de menú
  };

  // Función para redirigir al login con un mensaje de salida
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema"); // Mostramos un mensaje de despedida
    router.push("/login"); // Redirigimos al usuario al login
  };

  // Cálculos para paginación: obtenemos los usuarios que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem); // Mostramos los usuarios de la página actual

  return (
    <main className={styles.main}> {/* Contenedor principal */}
      <div className={styles.headerText}> {/* Título de la página */}
        <h1>Gestión de Usuarios</h1> {/* Título "Gestión de Usuarios" */}
      </div>

      {/* Formulario para ingresar los datos del usuario, organizado en dos grupos de 4 campos */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}> {/* Primer grupo de 4 campos */}
          <label className={styles.label}>Nombre de Usuario</label> {/* Etiqueta para el campo "Nombre de Usuario" */}
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario" // Texto que aparece en el input cuando está vacío
            value={formData.username} // Valor actual del nombre de usuario
            onChange={handleChange} // Manejador para actualizar el estado cuando se cambia el valor
            className={styles.input} // Estilo del input
          />

          <label className={styles.label}>Contraseña</label> {/* Etiqueta para el campo "Contraseña" */}
          <input
            type="text" // Hacemos visible la contraseña
            name="password"
            placeholder="Contraseña"
            value={formData.password} // Valor actual de la contraseña
            onChange={handleChange} // Manejador para actualizar el estado cuando se cambia el valor
            className={styles.input} // Estilo del input
          />

          <label className={styles.label}>Nombre</label> {/* Etiqueta para el campo "Nombre" */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Primer Apellido</label> {/* Etiqueta para el campo "Primer Apellido" */}
          <input
            type="text"
            name="primerApellido"
            placeholder="Primer Apellido"
            value={formData.primerApellido}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}> {/* Segundo grupo de 4 campos */}
          <label className={styles.label}>Segundo Apellido</label> {/* Etiqueta para el campo "Segundo Apellido" */}
          <input
            type="text"
            name="segundoApellido"
            placeholder="Segundo Apellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Correo</label> {/* Etiqueta para el campo "Correo" */}
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Teléfono</label> {/* Etiqueta para el campo "Teléfono" */}
          <input
            type="text"
            name="telefono"
            placeholder="Número de Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Cédula</label> {/* Etiqueta para el campo "Cédula" */}
          <input
            type="text"
            name="cedula"
            placeholder="Número de Cédula"
            value={formData.cedula}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      {/* Radio buttons para seleccionar el tipo de usuario (admin o regular) */}
      <div className={styles.radioContainer}>
        {/* Botón para seleccionar "Usuario Regular" */}
        <label className={styles.label}>
          <input
            type="radio"
            name="tipo"
            value="regular"
            checked={formData.tipo === "regular"} // Verificamos si el tipo de usuario es "regular"
            onChange={handleChange} // Actualizamos el estado cuando se selecciona
          />
          Usuario Regular
        </label>
        {/* Botón para seleccionar "Usuario Admin" */}
        <label className={styles.label}>
          <input
            type="radio"
            name="tipo"
            value="admin"
            checked={formData.tipo === "admin"} // Verificamos si el tipo de usuario es "admin"
            onChange={handleChange} // Actualizamos el estado cuando se selecciona
          />
          Usuario Admin
        </label>
      </div>

      {/* Botones de acciones (Guardar, Eliminar, Menú, Salir) */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Guardar</button> {/* Botón para guardar los datos del formulario */}
        <button onClick={() => handleDelete(formData.username)} className={styles.deleteButton}>Eliminar</button> {/* Botón para eliminar usuarios */}
        <button onClick={handleMenu} className={styles.menuButton}>Menú</button> {/* Botón para redirigir al menú */}
        <button onClick={handleLogout} className={styles.logoutButton}>Salir</button> {/* Botón para salir y redirigir al login */}
      </div>

      {/* Tabla para mostrar los usuarios registrados */}
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>#</th> {/* Columna para el número de usuario */}
              <th>Nombre de Usuario</th> {/* Columna para el nombre de usuario */}
              <th>Contraseña</th> {/* Columna para la contraseña (visible) */}
              <th>Nombre</th> {/* Columna para el nombre */}
              <th>1er Apellido</th> {/* Columna para el primer apellido */}
              <th>2do Apellido</th> {/* Columna para el segundo apellido */}
              <th>Correo</th> {/* Columna para el correo */}
              <th>Teléfono</th> {/* Columna para el teléfono */}
              <th>Cédula</th> {/* Columna para la cédula */}
              <th>Tipo de Usuario</th> {/* Nueva columna para mostrar el tipo de usuario (admin o regular) */}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index} onClick={() => handleEdit(user)}> {/* Al hacer clic en una fila, cargamos los datos del usuario */}
                <td>{index + 1}</td> {/* Número del usuario en la tabla */}
                <td>{user.username}</td> {/* Mostramos el nombre de usuario */}
                <td>{user.password}</td> {/* Mostramos la contraseña visible */}
                <td>{user.nombre}</td> {/* Mostramos el nombre */}
                <td>{user.primerApellido}</td> {/* Mostramos el primer apellido */}
                <td>{user.segundoApellido}</td> {/* Mostramos el segundo apellido */}
                <td>{user.correo}</td> {/* Mostramos el correo */}
                <td>{user.telefono}</td> {/* Mostramos el teléfono */}
                <td>{user.cedula}</td> {/* Mostramos la cédula */}
                <td>{user.tipo === "admin" ? "Admin" : "Regular"}</td> {/* Mostramos el tipo de usuario */}
              </tr>
            ))}
            {/* Rellenamos las filas vacías si no hay suficientes usuarios */}
            {Array.from({ length: 10 - currentUsers.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td colSpan={10}>&nbsp;</td> {/* Celdas vacías */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación: mostramos los botones para cambiar de página si hay más de 10 usuarios */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={styles.pageButton}>
            {`Página ${i + 1}`} {/* Mostramos el número de página */}
          </button>
        ))}
      </div>
    </main>
  );
}
