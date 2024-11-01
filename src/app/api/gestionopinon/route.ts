import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Función para obtener todas las opiniones desde la vista
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Consulta para obtener opiniones desde la vista `opinion_view`
    const [rows]: [any[], any] = await connection.execute(`
      SELECT * FROM opinion_view
    `);

    await connection.end();
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", (error as Error).message);
    return NextResponse.json({ message: "Error al obtener las opiniones", error: (error as Error).message }, { status: 500 });
  }
}

// Función para actualizar el comentario y el estado de una opinión
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { opinion_ID, comment, estado } = body;

    if (!opinion_ID) {
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig);
    const [result]: [any, any] = await connection.execute(
      "UPDATE opinion SET comment = ?, status_ID = ? WHERE opinion_ID = ?",
      [comment || null, estado === "Abierto" ? 1 : 2, opinion_ID]
    );

    await connection.end();
    return result.affectedRows === 0
      ? NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 })
      : NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la opinión:", (error as Error).message);
    return NextResponse.json({ message: "Error al actualizar la opinión", error: (error as Error).message }, { status: 500 });
  }
}
