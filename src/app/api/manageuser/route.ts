import express, { Request, Response } from "express"; // Importamos Express y los tipos Request y Response de TypeScript para definir las solicitudes y respuestas HTTP.
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "./userController"; // Importamos las funciones del controlador de usuarios.

const router = express.Router(); // Creamos una instancia del router de Express para manejar las rutas.

// Ruta para obtener todos los usuarios.
// Método HTTP: GET. Ruta: /api/users
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers(); // Llamamos a la función que obtiene todos los usuarios de la base de datos.
    res.json(users); // Enviamos la lista de usuarios en formato JSON.
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" }); // Si hay un error, enviamos un código 500 con un mensaje de error.
  }
});

// Ruta para obtener un usuario por su ID.
// Método HTTP: GET. Ruta: /api/users/:id
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Obtenemos el ID del usuario desde los parámetros de la URL.
    const user = await getUserById(userId); // Llamamos a la función que obtiene el usuario por su ID.
    if (user) {
      res.json(user); // Si el usuario existe, lo enviamos en formato JSON.
    } else {
      res.status(404).json({ message: "Usuario no encontrado" }); // Si no se encuentra el usuario, enviamos un código 404.
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" }); // Si hay un error, enviamos un código 500 con un mensaje de error.
  }
});

// Ruta para crear un nuevo usuario.
// Método HTTP: POST. Ruta: /api/users
router.post("/users", async (req: Request, res: Response) => {
  try {
    const newUser = req.body; // Obtenemos los datos del nuevo usuario desde el cuerpo de la solicitud.
    const createdUser = await createUser(newUser); // Llamamos a la función que crea un nuevo usuario en la base de datos.
    res.status(201).json(createdUser); // Enviamos el usuario creado con un código 201 (creado).
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario" }); // Si hay un error, enviamos un código 500 con un mensaje de error.
  }
});

// Ruta para actualizar un usuario por su ID.
// Método HTTP: PUT. Ruta: /api/users/:id
router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Obtenemos el ID del usuario desde los parámetros de la URL.
    const updatedData = req.body; // Obtenemos los datos actualizados desde el cuerpo de la solicitud.
    const updatedUser = await updateUser(userId, updatedData); // Llamamos a la función que actualiza el usuario en la base de datos.
    if (updatedUser) {
      res.json(updatedUser); // Si la actualización es exitosa, enviamos el usuario actualizado en formato JSON.
    } else {
      res.status(404).json({ message: "Usuario no encontrado" }); // Si no se encuentra el usuario, enviamos un código 404.
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" }); // Si hay un error, enviamos un código 500 con un mensaje de error.
  }
});

// Ruta para eliminar un usuario por su ID.
// Método HTTP: DELETE. Ruta: /api/users/:id
router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Obtenemos el ID del usuario desde los parámetros de la URL.
    const deletedUser = await deleteUser(userId); // Llamamos a la función que elimina el usuario de la base de datos.
    if (deletedUser) {
      res.json({ message: "Usuario eliminado con éxito" }); // Si la eliminación es exitosa, enviamos un mensaje de éxito.
    } else {
      res.status(404).json({ message: "Usuario no encontrado" }); // Si no se encuentra el usuario, enviamos un código 404.
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" }); // Si hay un error, enviamos un código 500 con un mensaje de error.
  }
});

export default router; // Exportamos el router para que pueda ser usado en otras partes de la aplicación.
