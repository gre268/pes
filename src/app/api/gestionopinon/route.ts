import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "123456789",
  database: "opinionwebsite",
  port: 3306,
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        ot.type AS opinion_type,
        o.description,
        c.detail AS comment,
        s.status AS estado,
        u.name AS nombre,
        u.lastName1 AS apellido,
        u.cedula,
        o.created_At AS fecha_registro
      FROM opinion AS o
      JOIN user AS u ON o.user_ID = u.user_ID
      JOIN status AS s ON o.status_ID = s.status_ID
      JOIN opinion_type AS ot ON o.opinion_TypeID = ot.opinion_TypeID
      LEFT JOIN comment AS c ON o.opinion_ID = c.opinion_ID
    `);
    await connection.end();
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", error);
    return NextResponse.json(
      { message: "Error al obtener las opiniones", error: String(error) },
      { status: 500 }
    );
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
    await connection.execute(
      `UPDATE opinion SET status_ID = ? WHERE opinion_ID = ?`,
      [status === "Abierto" ? 1 : 2, opinion_ID]
    );

    if (comment) {
      await connection.execute(
        `INSERT INTO comment (opinion_ID, detail) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE detail = ?`,
        [opinion_ID, comment, comment]
      );
    }

    await connection.end();
    return NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la opinión:", error);
    return NextResponse.json(
      { message: "Error al actualizar la opinión", error: String(error) },
      { status: 500 }
    );
  }
}
