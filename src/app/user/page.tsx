"use client"; // Este código se ejecuta en el cliente (navegador)
import styles from "./user.module.css"; // Importamos los estilos CSS específicos
import React, { useState, useEffect } from "react"; // Importamos React, useState y useEffect para manejar el estado y efectos secundarios
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones entre páginas

// Definimos la interfaz del usuario
interface User {
  user_ID: string;
  role_ID: string;
  userName: string;
  password: string;
  name: string;
  lastName1: string;
  lastName2: string;
  email: string;
  tel: string;
  cedula: string;
}

export default function AdministrarUsuarios() {
  // Estado para manejar los datos del formulario del usuario
  const [formData, setFormData] = useState<User>({
    user_ID: "",
    role_ID: "",
    userName: "",
    password: "",
    name: "",
    lastName1: "",
    lastName2: "",
    email: "",
    tel: "",
    cedula: ""
  });

  // Estado para manejar la lista de usuarios obtenida de la base de datos
  const [users, setUsers] = useState<User[]>([]); 
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const itemsPerPage = 10; // Número de usuarios por página
  const router = useRouter(); // Hook para manejar redirecciones

  // Hook useEffect para cargar la lista de usuarios al cargar la página
  useEffect(() => {
    fetchUsers(); // Llamamos a la función para obtener los usuarios
  }, []); // Este efecto solo se ejecuta una vez cuando la página se monta

  // Función para obtener los usuarios desde la API y actualizar la lista
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/manageuser", {
        method: "GET",
      });
      const data = await response.json();
      setUsers(data); // Actualizamos el estado con los usuarios obtenidos
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado con los nuevos valores
  };

  // Función para guardar o actualizar un usuario
  const handleSave = async () => {
    try {
      let response;
      if (formData.user_ID) {
        // Si existe un ID, significa que estamos actualizando un usuario
        response = await fetch(`/api/manageuser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Enviamos los datos del usuario a actualizar
        });
      } else {
        // Si no existe un ID, significa que estamos creando un nuevo usuario
        response = await fetch("/api/manageuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Enviamos los datos del nuevo usuario
        });
      }

      if (response.ok) {
        alert("¡Acciones realizadas con éxito!"); // Mostramos un mensaje de éxito
        setFormData({
          user_ID: "",
          role_ID: "",
          userName: "",
          password: "",
          name: "",
          lastName1: "",
          lastName2: "",
          email: "",
          tel: "",
          cedula: ""
        }); // Limpiamos el formulario
        fetchUsers(); // Llamamos a la función para obtener la lista actualizada de usuarios
      } else {
        alert("Error al realizar la acción");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al realizar la acción");
    }
  };

  // Función para cargar los datos del usuario en el formulario al hacer clic en una fila de la tabla
  const handleEdit = (user: User) => {
    setFormData(user); // Cargamos los datos del usuario seleccionado en el formulario
  };

  // Función para eliminar un usuario con confirmación
  const handleDelete = async (user_ID: string) => {
    const confirmDelete = confirm("¿Está seguro de eliminar este usuario?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/manageuser?id=${user_ID}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Usuario eliminado con éxito"); // Mostramos un mensaje de éxito
          fetchUsers(); // Refrescamos la lista de usuarios después de la eliminación
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  // Función para redirigir al menú principal
  const handleMenu = () => {
    router.push("/menu"); // Redirigimos al menú principal
  };

  // Función para redirigir al login
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema"); // Mostramos un mensaje de despedida
    router.push("/login"); // Redirigimos al login
  };

  // Paginación: calculamos los usuarios a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem); // Mostramos los usuarios de la página actual

  return (
    <main className={styles.main}>
      <div className={styles.headerText}>
        <h1>Gestión de Usuarios</h1> {/* Título de la página */}
      </div>

      {/* Formulario para ingresar o editar los datos del usuario */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre de Usuario</label>
          <input
            type="text"
            name="userName"
            placeholder="Nombre de Usuario"
            value={formData.userName}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>Nombre</label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>Primer Apellido</label>
          <input
            type="text"
            name="lastName1"
            placeholder="Primer Apellido"
            value={formData.lastName1}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Segundo Apellido</label>
          <input
            type="text"
            name="lastName2"
            placeholder="Segundo Apellido"
            value={formData.lastName2}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>Correo</label>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          <label className={styles.label}>Teléfono</label>
          <input
            type="text"
            name="tel"
            placeholder="Número de Teléfono"
            value={formData.tel}
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

      {/* Botones de acción: guardar, menú, salir */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
        <button onClick={handleMenu} className={styles.menuButton}>Menú</button>
        <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
      </div>

      {/* Tabla para mostrar los usuarios registrados */}
      {users.length > 0 ? ( // Verificamos si hay usuarios antes de renderizar la tabla
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre de Usuario</th>
                <th>Nombre</th>
                <th>1er Apellido</th>
                <th>2do Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Cédula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.userName}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName1}</td>
                  <td>{user.lastName2}</td>
                  <td>{user.email}</td>
                  <td>{user.tel}</td>
                  <td>{user.cedula}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} className={styles.editButton}>Editar</button>
                    <button onClick={() => handleDelete(user.user_ID)} className={styles.deleteButton}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay usuarios disponibles</p> // Mensaje si no hay usuarios
      )}

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
