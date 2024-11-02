import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
    console.log("Conexión exitosa para obtener totales y opiniones");

    // Especificamos el tipo de resultado como any[] para evitar errores de índice
    const [totals]: any[] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    const [opinions]: any[] = await connection.execute(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        o.description,
        c.detail AS comment,
        s.status AS estado,
        u.name,
        u.lastName1,
        u.cedula,
        o.created_At 
      FROM opinion AS o
      LEFT JOIN user AS u ON o.user_ID = u.user_ID
      LEFT JOIN status AS s ON o.status_ID = s.status_ID
      LEFT JOIN comment AS c ON o.opinion_ID = c.opinion_ID
    `);

    await connection.end();
    return NextResponse.json({ totals: totals[0], opinions });
  } catch (error) {
    console.error("Error al obtener totales y opiniones:", error);
    return NextResponse.json({ message: "Error al obtener datos" }, { status: 500 });
  }
}
