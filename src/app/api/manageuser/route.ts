import { NextResponse } from "next/server"; 
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para la conexión a la base de datos

// Definimos la conexión a la base de datos utilizando credenciales hardcoded
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Función para obtener todos los usuarios de la base de datos (GET)
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener usuarios");

    // Consulta para obtener todos los usuarios
    const [rows]: any[] = await connection.execute("SELECT * FROM user");

    if (rows.length === 0) {
      console.log("No hay usuarios en la base de datos.");
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ message: "No hay usuarios disponibles" }, { status: 200 });
    }

    console.log("Usuarios obtenidos exitosamente:", rows);
    await connection.end(); // Cerramos la conexión
    return NextResponse.json(rows); // Enviamos los usuarios obtenidos como respuesta en formato JSON
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener los usuarios:", error.message);
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

    if (!userName || !password || !name || !role_ID) {
      console.error("Faltan campos requeridos.");
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para crear usuario");

    const [result]: any = await connection.execute(
      "INSERT INTO user (role_ID, userName, password, name, lastName1, lastName2, email, tel, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [role_ID, userName, password, name, lastName1 || null, lastName2 || null, email || null, tel || null, cedula || null]
    );

    const insertedId = result.insertId;
    console.log("Usuario creado exitosamente con ID:", insertedId);
    await connection.end(); // Cerramos la conexión
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

    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para actualizar usuario");

    const [result]: any = await connection.execute(
      "UPDATE user SET role_ID = ?, userName = ?, password = ?, name = ?, lastName1 = ?, lastName2 = ?, email = ?, tel = ?, cedula = ? WHERE user_ID = ?",
      [role_ID, userName, password, name, lastName1 || null, lastName2 || null, email || null, tel || null, cedula || null, user_ID]
    );

    if (result.affectedRows === 0) {
      console.error("Usuario no encontrado con ID:", user_ID);
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("Usuario actualizado exitosamente con ID:", user_ID);
    await connection.end(); // Cerramos la conexión
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

    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para eliminar usuario");

    const [result]: any = await connection.execute("DELETE FROM user WHERE user_ID = ?", [id]);

    if (result.affectedRows === 0) {
      console.error("Usuario no encontrado para eliminar con ID:", id);
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("Usuario eliminado exitosamente con ID:", id);
    await connection.end(); // Cerramos la conexión
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
