import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js 13+
const pool = require("../../../config/database.js"); // Importamos la conexión a la base de datos desde config/database.js

// Función para obtener todos los usuarios de la base de datos (GET)
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM user"); // Consulta para obtener todos los usuarios de la tabla 'user'
    return NextResponse.json(rows); // Enviamos los usuarios obtenidos como respuesta en formato JSON
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener los usuarios" }, { status: 500 }); // Enviamos un mensaje de error si la consulta falla
  }
}

// Función para crear un nuevo usuario en la base de datos (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Extraemos los datos del nuevo usuario desde el cuerpo de la solicitud
    const { role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = body; // Desestructuramos los campos del usuario

    // Insertamos el nuevo usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO user (role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula]
    ); 

    const insertedId = result.insertId; // Obtenemos el ID del nuevo usuario creado
    return NextResponse.json({ user_ID: insertedId, ...body }, { status: 201 }); // Enviamos los detalles del nuevo usuario con el código 201 (creado)
  } catch (error) {
    return NextResponse.json({ message: "Error al crear el usuario" }, { status: 500 }); // Enviamos un mensaje de error si la creación falla
  }
}

// Función para actualizar un usuario por su ID (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Extraemos los datos actualizados desde el cuerpo de la solicitud
    const { user_ID, role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = body; // Desestructuramos los campos del usuario

    // Actualizamos los datos del usuario en la base de datos según el ID proporcionado
    const [result] = await pool.query(
      "UPDATE user SET role_ID = ?, userName = ?, password = ?, name = ?, lastName1 = ?, lastName2 = ?, email = ?, tel = ?, cedula = ? WHERE user_ID = ?",
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula, user_ID]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 }); // Si no se encuentra el usuario, enviamos un código 404
    }

    return NextResponse.json({ message: "Usuario actualizado con éxito" }); // Enviamos un mensaje de éxito si la actualización fue exitosa
  } catch (error) {
    return NextResponse.json({ message: "Error al actualizar el usuario" }, { status: 500 }); // Enviamos un mensaje de error si la actualización falla
  }
}

// Función para eliminar un usuario por su ID (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url); // Extraemos los parámetros de la URL
    const id = searchParams.get("id"); // Obtenemos el ID del usuario desde los parámetros de la URL

    // Eliminamos el usuario de la base de datos por su ID
    const [result] = await pool.query("DELETE FROM user WHERE user_ID = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 }); // Si no se encuentra el usuario, enviamos un código 404
    }

    return NextResponse.json({ message: "Usuario eliminado con éxito" }); // Enviamos un mensaje de éxito si la eliminación fue exitosa
  } catch (error) {
    return NextResponse.json({ message: "Error al eliminar el usuario" }, { status: 500 }); // Enviamos un mensaje de error si la eliminación falla
  }
}
