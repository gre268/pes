// route.ts
import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from 'mysql2/promise';

const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Definimos el tipo de datos para las opiniones y los totales
interface OpinionData extends RowDataPacket {
  id: number;
  tipo: string;
  estado: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

interface Totals extends RowDataPacket {
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
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consulta para obtener todas las opiniones con sus detalles necesarios
    const [opinions] = await connection.execute<OpinionData[]>(`
      SELECT 
        o.opinion_ID AS id,
        CASE WHEN o.opinion_TypeID = 1 THEN 'Queja' ELSE 'Sugerencia' END AS tipo,
        CASE WHEN o.status_ID = 1 THEN 'Abierto' ELSE 'Cerrado' END AS estado,
        o.description AS descripcion,
        o.created_At AS fecha,
        u.name AS nombre,
        u.lastName1 AS apellido,
        u.cedula
      FROM opinion o
      JOIN user u ON o.user_ID = u.user_ID
      ORDER BY o.opinion_ID ASC
    `);

    // Consulta para obtener los totales de quejas y sugerencias abiertas y cerradas
    const [[totals]] = await connection.execute<Totals[]>(`
      SELECT 
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

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
