"use client"; // Indicamos que este código se ejecuta en el cliente (navegador)
import styles from "./user.module.css"; // Importamos los estilos CSS específicos para el módulo de gestión de usuarios
import React, { useState, useEffect } from "react"; // Importamos React, useState y useEffect para manejar el estado y los efectos secundarios
import { useRouter } from "next/navigation"; // Importamos useRouter para manejar redirecciones entre páginas

// Definimos la interfaz del usuario para tipar correctamente los datos de cada usuario
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
  // Estado para manejar los datos del formulario de usuario
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

  // Estado para manejar la lista de usuarios obtenidos de la base de datos
  const [users, setUsers] = useState<User[]>([]); // Iniciamos con un array vacío para evitar errores de renderizado
  const [loading, setLoading] = useState(true); // Estado para manejar el proceso de carga
  const [currentPage, setCurrentPage] = useState(1); // Estado para manejar la paginación
  const itemsPerPage = 10; // Definimos el número de usuarios que se mostrarán por página
  const router = useRouter(); // Hook para manejar las redirecciones a otras páginas

  // useEffect: Cuando el componente se monta, obtenemos los usuarios desde la API
  useEffect(() => {
    fetchUsers(); // Llamamos a la función para obtener la lista de usuarios
  }, []); // Este efecto solo se ejecuta cuando el componente se monta

  // Función para obtener los usuarios desde la API y actualizar el estado de `users`
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/manageuser", {
        method: "GET", // Realizamos una solicitud GET a la API
      });
      const data = await response.json(); // Convertimos la respuesta a formato JSON
      setUsers(data || []); // Actualizamos el estado de usuarios con los datos obtenidos, y aseguramos que sea un array
      setLoading(false); // Cambiamos el estado de `loading` a false cuando los datos se hayan cargado
    } catch (error) {
      console.error("Error al obtener los usuarios:", error); // Si hay un error, lo registramos en la consola
      setLoading(false); // Aún cuando hay un error, debemos detener el estado de carga
    }
  };

  // Función para manejar los cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extraemos el nombre y el valor del input
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado con los nuevos valores del input
  };

  // Función para guardar o actualizar un usuario en la base de datos
  const handleSave = async () => {
    try {
      let response;
      if (formData.user_ID) {
        // Si el ID de usuario existe, estamos actualizando un usuario existente
        response = await fetch(`/api/manageuser`, {
          method: "PUT", // Método PUT para actualizar un usuario
          headers: {
            "Content-Type": "application/json", // Especificamos que el contenido es JSON
          },
          body: JSON.stringify(formData), // Enviamos los datos del usuario en el cuerpo de la solicitud
        });
      } else {
        // Si no existe un ID, estamos creando un nuevo usuario
        response = await fetch("/api/manageuser", {
          method: "POST", // Método POST para crear un nuevo usuario
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        alert("¡Acciones realizadas con éxito!"); // Mostramos un mensaje de éxito
        // Limpiamos el formulario para que esté listo para un nuevo ingreso
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
        });
        fetchUsers(); // Volvemos a obtener la lista de usuarios actualizada desde la API
      } else {
        alert("Error al realizar la acción"); // Mostramos un mensaje de error si la operación falla
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error); // Si ocurre un error, lo mostramos en la consola
      alert("Error al realizar la acción");
    }
  };

  // Función para cargar los datos de un usuario en el formulario al hacer clic en la fila de la tabla
  const handleEdit = (user: User) => {
    setFormData(user); // Cargamos los datos del usuario en el formulario para su edición
  };

  // Función para eliminar un usuario con confirmación
  const handleDelete = async (user_ID: string) => {
    const confirmDelete = confirm("¿Está seguro de eliminar este usuario?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/manageuser?id=${user_ID}`, {
          method: "DELETE", // Usamos DELETE para eliminar un usuario por su ID
        });

        if (response.ok) {
          alert("Usuario eliminado con éxito"); // Mostramos un mensaje de éxito
          fetchUsers(); // Refrescamos la lista de usuarios después de la eliminación
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error); // Mostramos el error en la consola si ocurre
      }
    }
  };

  // Función para redirigir al menú principal
  const handleMenu = () => {
    router.push("/menu"); // Redirigimos al menú principal
  };

  // Función para cerrar la sesión y redirigir al login
  const handleLogout = () => {
    alert("Gracias por utilizar el sistema");
    router.push("/login"); // Redirigimos al login
  };

  // Paginación: calculamos los usuarios que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstItem, indexOfLastItem) : []; // Verificamos que `users` sea un array válido antes de aplicar `.slice()`

  return (
    <main className={styles.main}>
      <div className={styles.headerText}>
        <h1>Gestión de Usuarios</h1> {/* Título principal */}
      </div>

      {loading ? (
        <p>Cargando usuarios...</p> // Mostramos un mensaje mientras los usuarios están siendo cargados
      ) : (
        <>
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

          {/* Botones de acción */}
          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
            <button onClick={handleMenu} className={styles.menuButton}>Menú</button>
            <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
          </div>

          {/* Tabla para mostrar los usuarios registrados */}
          {users.length > 0 ? (
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
            <p>No hay usuarios disponibles</p> // Mostramos un mensaje si no hay usuarios
          )}

          {/* Paginación */}
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={styles.pageButton}>
                {`Página ${i + 1}`}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
