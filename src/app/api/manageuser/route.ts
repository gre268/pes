import { NextResponse } from "next/server";
const pool = require("../../config/database.js");

// Función para obtener todos los usuarios de la base de datos (GET)
export async function GET() {
  try {
    console.log("Intentando obtener los usuarios desde la base de datos..."); // Log para rastrear el inicio del proceso
    const [rows] = await pool.query("SELECT * FROM user"); // Consulta para obtener todos los usuarios

    if (rows.length === 0) {
      console.log("No hay usuarios en la base de datos.");
      return NextResponse.json({ message: "No hay usuarios disponibles" }, { status: 200 });
    }

    console.log("Usuarios obtenidos exitosamente:", rows); // Log de éxito al obtener usuarios
    return NextResponse.json(rows); // Enviamos los usuarios obtenidos como respuesta en formato JSON
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los usuarios:", error.message); // Registramos el error con más detalle
      return NextResponse.json({ message: "Error al obtener los usuarios", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al obtener usuarios:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para crear un nuevo usuario en la base de datos (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = body;

    // Validación de campos requeridos
    if (!userName || !password || !name || !role_ID) {
      console.error("Faltan campos requeridos.");
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    // Insertamos el nuevo usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO user (role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [role_ID, userName, password, name, lastName1 || null, lastName2 || null, email || null, tel || null, cedula || null]
    );

    const insertedId = result.insertId;
    console.log("Usuario creado exitosamente con ID:", insertedId);
    return NextResponse.json({ user_ID: insertedId, ...body }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al crear el usuario:", error.message);
      return NextResponse.json({ message: "Error al crear el usuario", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al crear usuario:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para actualizar un usuario por su ID (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { user_ID, role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = body;

    if (!user_ID) {
      console.error("Falta el ID del usuario.");
      return NextResponse.json({ message: "Falta el ID del usuario" }, { status: 400 });
    }

    // Actualizamos los datos del usuario en la base de datos
    const [result] = await pool.query(
      "UPDATE user SET role_ID = ?, userName = ?, password = ?, name = ?, lastName1 = ?, lastName2 = ?, email = ?, tel = ?, cedula = ? WHERE user_ID = ?",
      [role_ID, userName, password, name, lastName1 || null, lastName2 || null, email || null, tel || null, cedula || null, user_ID]
    );

    if (result.affectedRows === 0) {
      console.error("Usuario no encontrado con ID:", user_ID);
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("Usuario actualizado exitosamente con ID:", user_ID);
    return NextResponse.json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el usuario:", error.message);
      return NextResponse.json({ message: "Error al actualizar el usuario", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al actualizar usuario:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para eliminar un usuario por su ID (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      console.error("Falta el ID del usuario.");
      return NextResponse.json({ message: "Falta el ID del usuario" }, { status: 400 });
    }

    const [result] = await pool.query("DELETE FROM user WHERE user_ID = ?", [id]);

    if (result.affectedRows === 0) {
      console.error("Usuario no encontrado para eliminar con ID:", id);
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("Usuario eliminado exitosamente con ID:", id);
    return NextResponse.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al eliminar el usuario:", error.message);
      return NextResponse.json({ message: "Error al eliminar el usuario", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al eliminar usuario:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}
