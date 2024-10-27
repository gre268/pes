import { NextResponse } from "next/server";
const pool = require("../../config/database.js"); // Importamos la conexión a la base de datos

// Función para obtener todos los usuarios de la base de datos (GET)
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM user"); // Consulta para obtener todos los usuarios de la tabla 'user'
    if (rows.length === 0) {
      return NextResponse.json({ message: "No hay usuarios disponibles" }, { status: 200 });
    }
    return NextResponse.json(rows); // Enviamos los usuarios obtenidos como respuesta en formato JSON
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los usuarios:", error.message); // Mostramos el error en la consola del servidor
      return NextResponse.json({ message: "Error al obtener los usuarios", error: error.message }, { status: 500 });
    }
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
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO user (role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula]
    );

    const insertedId = result.insertId;
    return NextResponse.json({ user_ID: insertedId, ...body }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al crear el usuario:", error.message);
      return NextResponse.json({ message: "Error al crear el usuario", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para actualizar un usuario por su ID (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { user_ID, role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula } = body;

    if (!user_ID) {
      return NextResponse.json({ message: "Falta el ID del usuario" }, { status: 400 });
    }

    const [result] = await pool.query(
      "UPDATE user SET role_ID = ?, userName = ?, password = ?, name = ?, lastName1 = ?, lastName2 = ?, email = ?, tel = ?, cedula = ? WHERE user_ID = ?",
      [role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula, user_ID]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el usuario:", error.message);
      return NextResponse.json({ message: "Error al actualizar el usuario", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para eliminar un usuario por su ID (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Falta el ID del usuario" }, { status: 400 });
    }

    const [result] = await pool.query("DELETE FROM user WHERE user_ID = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al eliminar el usuario:", error.message);
      return NextResponse.json({ message: "Error al eliminar el usuario", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}
