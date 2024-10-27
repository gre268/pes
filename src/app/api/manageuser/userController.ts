const pool = require("./database.js"); // Cambiamos a require() para evitar problemas con TypeScript

// Función para obtener todos los usuarios de la base de datos.
export const getAllUsers = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM user");
    return rows; // Devolvemos los usuarios obtenidos
  } catch (error) {
    throw new Error("Error al obtener los usuarios: " + (error as Error).message);
  }
};

// Función para obtener un usuario por su ID desde la base de datos.
export const getUserById = async (id: string) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE user_ID = ?", [id]);
    if (rows.length > 0) {
      return rows[0]; // Si el usuario existe, lo devolvemos
    } else {
      return null; // Si no existe, devolvemos null
    }
  } catch (error) {
    throw new Error("Error al obtener el usuario: " + (error as Error).message);
  }
};

// Función para crear un nuevo usuario en la base de datos.
export const createUser = async (newUser: any) => {
  const { role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = newUser;
  
  try {
    const [result] = await pool.query(
      "INSERT INTO user (role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula]
    );
    const insertedId = result.insertId;
    return { user_ID: insertedId, ...newUser };
  } catch (error) {
    throw new Error("Error al crear el usuario: " + (error as Error).message);
  }
};

// Función para actualizar los datos de un usuario en la base de datos.
export const updateUser = async (id: string, updatedData: any) => {
  const { role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = updatedData;
  
  try {
    const [result] = await pool.query(
      "UPDATE user SET role_ID = ?, userName = ?, password = ?, name = ?, lastName1 = ?, lastName2 = ?, email = ?, tel = ?, cedula = ? WHERE user_ID = ?", 
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { user_ID: id, ...updatedData };
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + (error as Error).message);
  }
};

// Función para eliminar un usuario por su ID desde la base de datos.
export const deleteUser = async (id: string) => {
  try {
    const [result] = await pool.query("DELETE FROM user WHERE user_ID = ?", [id]);
    if (result.affectedRows === 0) {
      return null;
    }
    return { message: "Usuario eliminado con éxito" };
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + (error as Error).message);
  }
};
