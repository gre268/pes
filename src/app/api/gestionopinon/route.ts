import { NextResponse } from "next/server"; // Importa NextResponse para manejar respuestas en Next.js
import mysql from "mysql2/promise"; // Importa mysql2/promise para conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "123456789",
  database: "opinionwebsite",
  port: 3306,
};

// Función para obtener todas las opiniones desde la base de datos (GET)
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute(
      `SELECT opinion_ID, opinion_TypeID, description, comment, status, name, lastName1, cedula, created_At 
      FROM opinion`
    );
    await connection.end();
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", error);
    return NextResponse.json({ message: "Error al obtener las opiniones" }, { status: 500 });
  }
}

// Función para actualizar una opinión en la base de datos (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { opinion_ID, comment, status } = body;

    if (!opinion_ID) {
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig);
    const [result]: any = await connection.execute(
      `UPDATE opinion SET comment = ?, status = ? WHERE opinion_ID = ?`,
      [comment || null, status, opinion_ID]
    );
    await connection.end();

    // Verificación de `affectedRows` para asegurar que se actualizó la opinión
    if (result && result.affectedRows === 0) {
      return NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la opinión:", error);
    return NextResponse.json({ message: "Error al actualizar la opinión" }, { status: 500 });
  }
}
