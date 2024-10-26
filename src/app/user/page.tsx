"use client";
import React, { useState } from "react";
import styles from "./user.module.css";

// Definir la interfaz para los usuarios
interface User {
  username: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { username: "admin1", role: "admin" },
    { username: "user1", role: "regular" },
  ]);

  const [formData, setFormData] = useState<User>({ username: "", role: "regular" });

  // Función para manejar los cambios en los campos de entrada del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para guardar los cambios o crear un nuevo usuario
  const handleSave = () => {
    const updatedUsers = users.map((user) =>
      user.username === formData.username
        ? { ...user, ...formData } // Si el usuario existe, lo actualizamos
        : user
    );
    setUsers([...updatedUsers, formData]); // Añadimos el nuevo usuario o actualizamos el existente
    alert("Usuario guardado");
  };

  return (
    <div className={styles.userManagement}>
      <h1>Gestión de Usuarios</h1>
      <form>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rol:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="regular">Regular</option>
          </select>
        </label>
        <button type="button" onClick={handleSave}>
          Guardar
        </button>
      </form>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
