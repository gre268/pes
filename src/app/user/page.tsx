"use client"; // Este código se ejecuta en el navegador (cliente).
import styles from "./user.module.css"; // Importamos los estilos CSS para el módulo de Gestión de Usuarios.
import React, { useState } from "react"; // Importamos React y el hook useState para manejar el estado.
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones entre páginas.

// Definimos la interfaz para los usuarios.
interface User {
  username: string;
  password: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  telefono: string;
  cedula: string;
  tipo: string;
}

export default function AdministrarUsuarios() {
  // Estado inicial para manejar los datos del formulario de usuario.
  const [formData, setFormData] = useState<User>({
    username: "",
    password: "",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    telefono: "",
    cedula: "",
    tipo: "regular",
  });

  // Estado para manejar la lista de usuarios registrados.
  const [users, setUsers] = useState<User[]>([]);

  // Estado para manejar la página actual en la tabla (paginación).
  const [currentPage, setCurrentPage] = useState(1);

  // Definimos el número de usuarios que se mostrarán por página.
  const itemsPerPage = 10;

  // Hook para manejar las redirecciones entre páginas.
  const router = useRouter();

  // Función para manejar los cambios en los inputs del formulario.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado del formulario.
  };

  // Función para guardar los datos del usuario (crear o actualizar).
  const handleSave = () => {
    const isExistingUser = users.some((user) => user.username === formData.username); // Verificamos si el usuario ya existe.
    if (!isExistingUser) {
      setUsers([...users, formData]); // Si no existe, lo agregamos a la lista.
      alert("Usuario agregado con éxito!");
    } else {
      alert("El usuario ya existe!"); // Mostramos un mensaje si el usuario ya existe.
    }
    setFormData({
      username: "",
      password: "",
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      correo: "",
      telefono: "",
      cedula: "",
      tipo: "regular",
    }); // Limpiamos los campos del formulario después de guardar.
  };

  // Función para actualizar los datos del usuario seleccionado.
  const handleUpdate = () => {
    const updatedUsers = users.map((user) =>
      user.username === formData.username ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers); // Actualizamos la lista con los nuevos datos.
    alert("¡Usuario actualizado con éxito!"); // Mostramos un mensaje de éxito.
    setFormData({
      username: "",
      password: "",
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      correo: "",
      telefono: "",
      cedula: "",
      tipo: "regular",
    }); // Limpiamos los campos del formulario después de actualizar.
  };

  // Función para cargar los datos del usuario seleccionado al hacer clic en una fila de la tabla.
  const handleEdit = (user: User) => {
    setFormData({
      username: user.username,
      password: user.password,
      nombre: user.nombre,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      correo: user.correo,
      telefono: user.telefono,
      cedula: user.cedula,
      tipo: user.tipo,
    }); // Cargamos los datos del usuario en los campos del formulario.
  };

  // Función para eliminar un usuario con confirmación.
  const handleDelete = (username: string) => {
    const confirmDelete = confirm("Confirmar Acción: ¿Está seguro de eliminar este usuario?");
    if (confirmDelete) {
      setUsers(users.filter((user) => user.username !== username)); // Eliminamos el usuario si se confirma la acción.
      alert("Usuario eliminado con éxito!"); // Mostramos un mensaje de éxito.
    }
  };

  // Función para redirigir al menú principal.
  const handleMenu = () => {
    router.push("/menu"); // Redirigimos al usuario al módulo de menú.
  };

  // Función para redirigir al login con un mensaje de salida.
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema");
    router.push("/login");
  };

  // Cálculos para paginación: obtenemos los usuarios que se deben mostrar en la página actual.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem); // Mostramos los usuarios de la página actual.

  return (
    <main className={styles.main}>
      <div className={styles.headerText}>
        <h1>Gestión de Usuarios</h1>
      </div>

      {/* Formulario para ingresar los datos del usuario */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Contraseña</label>
          <input
            type="text"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Primer Apellido</label>
          <input
            type="text"
            name="primerApellido"
            placeholder="Primer Apellido"
            value={formData.primerApellido}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Segundo Apellido</label>
          <input
            type="text"
            name="segundoApellido"
            placeholder="Segundo Apellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Correo</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Teléfono</label>
          <input
            type="text"
            name="telefono"
            placeholder="Número de Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Cédula</label>
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
        <label className={styles.label}>
          <input
            type="radio"
            name="tipo"
            value="regular"
            checked={formData.tipo === "regular"}
            onChange={handleChange}
          />
          Usuario Regular
        </label>
        <label className={styles.label}>
          <input
            type="radio"
            name="tipo"
            value="admin"
            checked={formData.tipo === "admin"}
            onChange={handleChange}
          />
          Usuario Admin
        </label>
      </div>

      {/* Botones de acciones */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
        <button onClick={handleUpdate} className={styles.updateButton}>Actualizar</button> {/* Nuevo botón de actualizar */}
        <button onClick={() => handleDelete(formData.username)} className={styles.deleteButton}>Eliminar</button>
        <button onClick={handleMenu} className={styles.menuButton}>Menú</button>
        <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
      </div>

      {/* Tabla para mostrar los usuarios registrados */}
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre de Usuario</th>
              <th>Contraseña</th>
              <th>Nombre</th>
              <th>1er Apellido</th>
              <th>2do Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Cédula</th>
              <th>Tipo de Usuario</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index} onClick={() => handleEdit(user)}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.nombre}</td>
                <td>{user.primerApellido}</td>
                <td>{user.segundoApellido}</td>
                <td>{user.correo}</td>
                <td>{user.telefono}</td>
                <td>{user.cedula}</td>
                <td>{user.tipo === "admin" ? "Admin" : "Regular"}</td>
              </tr>
            ))}
            {/* Rellenar las filas vacías hasta completar 10 filas por página */}
            {Array.from({ length: 10 - currentUsers.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td colSpan={10}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={styles.pageButton}>
            {`Página ${i + 1}`}
          </button>
        ))}
      </div>
    </main>
  );
}
