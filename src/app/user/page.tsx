"use client";
import styles from "./user.module.css"; // Importamos los estilos CSS específicos para este módulo
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para manejar la navegación entre páginas

// Definimos la interfaz del usuario para manejar los datos correctamente
interface User {
  user_ID: string;
  role_ID: string; // Este campo manejará el rol (regular o admin)
  userName: string;
  password: string; // Contraseña visible para el administrador
  name: string;
  lastName1: string;
  lastName2: string;
  email: string;
  tel: string;
  cedula: string;
}

export default function AdministrarUsuarios() {
  const [formData, setFormData] = useState<User>({
    user_ID: "",
    role_ID: "1", // Por defecto, el rol será "regular" (1 = regular, 2 = admin)
    userName: "",
    password: "",
    name: "",
    lastName1: "",
    lastName2: "",
    email: "",
    tel: "",
    cedula: ""
  });

  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios
  const [loading, setLoading] = useState(true); // Estado de carga mientras se obtienen los usuarios
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const itemsPerPage = 10; // Número de usuarios por página
  const router = useRouter(); // Hook para manejar redirecciones

  useEffect(() => {
    fetchUsers(); // Llamamos a la API para obtener los usuarios
  }, []);

  // Función para obtener los usuarios desde la API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/manageuser", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      setUsers(data || []);
      setLoading(false); // Terminamos el estado de carga
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setLoading(false);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado con los valores del formulario
  };

  // Función para manejar el cambio del radio button (Regular o Admin)
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, role_ID: e.target.value }); // Cambiamos el rol del usuario según el radio button seleccionado
  };

  // Función para validar que los campos requeridos estén completos
  const validateFields = () => {
    if (!formData.userName || !formData.password || !formData.name || !formData.role_ID) {
      return false; // Si falta algún campo requerido, devolvemos `false`
    }
    return true; // Si todo está correcto, devolvemos `true`
  };

  // Función para guardar o actualizar un usuario
  const handleSave = async () => {
    if (!validateFields()) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      let response;
      if (formData.user_ID) {
        // Si el usuario ya existe, lo actualizamos
        response = await fetch(`/api/manageuser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Enviamos todos los datos del formulario, incluyendo el rol
        });
      } else {
        // Si es un nuevo usuario, lo creamos con rol Regular por defecto
        response = await fetch("/api/manageuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Enviamos todos los datos del formulario, incluyendo el rol
        });
      }

      if (response.ok) {
        alert("¡Acción realizada con éxito!");
        setFormData({
          user_ID: "",
          role_ID: "1", // Por defecto, regular
          userName: "",
          password: "",
          name: "",
          lastName1: "",
          lastName2: "",
          email: "",
          tel: "",
          cedula: ""
        });
        fetchUsers(); // Refrescamos la lista de usuarios
      } else {
        alert("Error al realizar la acción");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al realizar la acción");
    }
  };

  // Función para editar un usuario al hacer clic en una fila de la tabla
  const handleEdit = (user: User) => {
    setFormData(user); // Cargamos los datos del usuario en el formulario para editarlos, incluyendo su rol
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
          alert("Usuario eliminado con éxito");
          fetchUsers(); // Refrescamos la lista de usuarios después de eliminar
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  // Funciones para redirigir al menú o al login
  const handleMenu = () => {
    router.push("/menu");
  };

  const handleLogout = () => {
    alert("Gracias por utilizar el sistema");
    router.push("/login");
  };

  // Paginación: obtenemos los usuarios que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstItem, indexOfLastItem) : [];

  return (
    <main className={styles.main}>
      <div className={styles.headerText}>
        <h1>Gestión de Usuarios</h1>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
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
                type="text" // Contraseña visible
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

              {/* Radio buttons para seleccionar el rol del usuario */}
              <div className={styles.radioPosition}>
                <div className={styles.radioContainer}>
                  <label className={styles.label}>
                    <input
                      type="radio"
                      name="role_ID"
                      value="1" // 1 = Usuario Regular
                      checked={formData.role_ID === "1"}
                      onChange={handleRoleChange}
                    />
                    Usuario Regular
                  </label>
                  <label className={styles.label}>
                    <input
                      type="radio"
                      name="role_ID"
                      value="2" // 2 = Usuario Admin
                      checked={formData.role_ID === "2"}
                      onChange={handleRoleChange}
                    />
                    Usuario Admin
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.saveButton}>
              {formData.user_ID ? "Actualizar" : "Guardar"}
            </button>
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
                    <th>Rol</th>
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
                      <td>{user.role_ID === "1" ? "Regular" : "Admin"}</td> {/* Mostramos el rol según el valor de role_ID */}
                      <td>
                        {/* Botón de Editar (actualizar) */}
                        <button onClick={() => handleEdit(user)} className={styles.editButton}>
                          Actualizar
                        </button>
                        {/* Botón de Eliminar */}
                        <button onClick={() => handleDelete(user.user_ID)} className={styles.deleteButton}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay usuarios disponibles</p>
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
