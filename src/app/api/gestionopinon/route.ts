import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows]: [any[], any] = await connection.execute(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        o.description,
        o.comment,
        s.status AS status,
        u.name,
        u.lastName1,
        u.cedula,
        o.created_At 
      FROM opinion AS o
      JOIN user AS u ON o.user_ID = u.user_ID
      JOIN status AS s ON o.status_ID = s.status_ID
    `);

    await connection.end();
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", (error as Error).message);
    return NextResponse.json({ message: "Error al obtener las opiniones", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { opinion_ID, comment, status } = body;

    if (!opinion_ID) {
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig);
    const [result]: [any, any] = await connection.execute(
      "UPDATE opinion SET comment = ?, status_ID = ? WHERE opinion_ID = ?",
      [comment || null, status === "Abierto" ? 1 : 2, opinion_ID]
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
