// Archivo: route.ts
import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from 'mysql2/promise';

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Definimos el tipo de datos de la vista ReportView
interface ReportData extends RowDataPacket {
  id: number;
  tipo_texto: string;
  estado: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

// Definimos el tipo de datos para los totales
interface Totals extends RowDataPacket {
  totalQuejas: number;
  totalSugerencias: number;
  totalQuejasAbiertas: number;
  totalQuejasCerradas: number;
  totalSugerenciasAbiertas: number;
  totalSugerenciasCerradas: number;
}

// Función para manejar la solicitud GET y obtener los datos de la vista ReportView y los totales
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consulta a la vista ReportView para obtener todos los datos consolidados
    const [reportData] = await connection.execute<ReportData[]>(`SELECT * FROM ReportView`);

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

    return NextResponse.json({ opinions: reportData, totals });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
