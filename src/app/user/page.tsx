"use client";
import styles from "./user.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [formData, setFormData] = useState<User>({
    user_ID: "",
    role_ID: "",
    userName: "",
    password: "", // Contraseña visible para el administrador
    name: "",
    lastName1: "",
    lastName2: "",
    email: "",
    tel: "",
    cedula: ""
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/manageuser", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      setUsers(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      let response;
      if (formData.user_ID) {
        response = await fetch(`/api/manageuser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch("/api/manageuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        alert("¡Acción realizada con éxito!");
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
        fetchUsers();
      } else {
        alert("Error al realizar la acción");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al realizar la acción");
    }
  };

  const handleEdit = (user: User) => {
    setFormData(user);
  };

  const handleDelete = async (user_ID: string) => {
    const confirmDelete = confirm("¿Está seguro de eliminar este usuario?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/manageuser?id=${user_ID}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Usuario eliminado con éxito");
          fetchUsers();
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const handleMenu = () => {
    router.push("/menu");
  };

  const handleLogout = () => {
    alert("Gracias por utilizar el sistema");
    router.push("/login");
  };

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
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
            <button onClick={handleMenu} className={styles.menuButton}>Menú</button>
            <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
          </div>

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
            <p>No hay usuarios disponibles</p>
          )}

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
