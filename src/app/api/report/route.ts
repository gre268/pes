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
interface Opinion extends RowDataPacket {
  id: number;
  tipo: string;
  estado: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
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
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consulta para obtener todas las opiniones con sus detalles necesarios
    const [opinions] = await connection.execute<Opinion[]>(`
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

    // Consultas individuales para obtener los totales de quejas y sugerencias
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

    await connection.end();

    // Configurar encabezados de no-caché en la respuesta de la API
    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });

    return NextResponse.json({ opinions, totals }, { headers });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
