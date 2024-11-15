// Archivo: src/app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from 'mysql2/promise';

const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

interface Opinion extends RowDataPacket {
  opinion_ID: number;
  opinion_TypeID: number;
  opinion_type: string;
  description: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_registro: string;
  comentario: string; // Último comentario de cada opinión
}

interface Totals {
  totalQuejas: number;
  totalSugerencias: number;
  totalQuejasAbiertas: number;
  totalQuejasCerradas: number;
  totalSugerenciasAbiertas: number;
  totalSugerenciasCerradas: number;
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener las opiniones y los totales");

    // Consulta para obtener cada opinión con el último comentario asociado y ordenada por tipo de opinión
    const [opinions] = await connection.execute<Opinion[]>(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        CASE WHEN o.opinion_TypeID = 1 THEN 'Queja' ELSE 'Sugerencia' END AS opinion_type,
        o.description,
        CASE WHEN o.status_ID = 1 THEN 'Abierto' ELSE 'Cerrado' END AS estado,
        u.name AS nombre,
        u.lastName1 AS apellido,
        u.cedula,
        o.created_At AS fecha_registro,
        c.detail AS comentario
      FROM opinion o
      JOIN user u ON o.user_ID = u.user_ID
      LEFT JOIN (
        SELECT opinion_ID, detail
        FROM comment
        WHERE (opinion_ID, comment_ID) IN (
          SELECT opinion_ID, MAX(comment_ID)
          FROM comment
          GROUP BY opinion_ID
        )
      ) c ON o.opinion_ID = c.opinion_ID
      ORDER BY o.opinion_TypeID ASC, o.opinion_ID ASC
    `);

    console.log("Opiniones obtenidas de la base de datos:", opinions); // Log para verificar las opiniones

    // Consultas para obtener los totales de quejas y sugerencias
    const [[{ totalQuejas }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalQuejas FROM opinion WHERE opinion_TypeID = 1
    `) as unknown as [{ totalQuejas: number }[], RowDataPacket[]];

    const [[{ totalSugerencias }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalSugerencias FROM opinion WHERE opinion_TypeID = 2
    `) as unknown as [{ totalSugerencias: number }[], RowDataPacket[]];

    const [[{ totalQuejasAbiertas }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalQuejasAbiertas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1
    `) as unknown as [{ totalQuejasAbiertas: number }[], RowDataPacket[]];

    const [[{ totalQuejasCerradas }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalQuejasCerradas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2
    `) as unknown as [{ totalQuejasCerradas: number }[], RowDataPacket[]];

    const [[{ totalSugerenciasAbiertas }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalSugerenciasAbiertas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1
    `) as unknown as [{ totalSugerenciasAbiertas: number }[], RowDataPacket[]];

    const [[{ totalSugerenciasCerradas }]] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(*) AS totalSugerenciasCerradas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2
    `) as unknown as [{ totalSugerenciasCerradas: number }[], RowDataPacket[]];

    const totals: Totals = {
      totalQuejas,
      totalSugerencias,
      totalQuejasAbiertas,
      totalQuejasCerradas,
      totalSugerenciasAbiertas,
      totalSugerenciasCerradas,
    };

    console.log("Totales calculados:", totals); // Log para verificar los totales calculados

    await connection.end();

    return NextResponse.json({ opinions, totals });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
