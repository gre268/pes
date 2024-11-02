import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js
import mysql from "mysql2/promise"; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Función para obtener los totales y opiniones desde la base de datos
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Consulta para obtener los totales
    const [totalResults]: any[] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    // Consulta para obtener las opiniones desde la vista 'opinion_view'
    const [opinionResults]: any[] = await connection.execute(`
      SELECT opinion_ID, opinion_type, description, name, lastName1, cedula, fecha_registro, estado
      FROM opinion_view
    `);

    await connection.end();

    return NextResponse.json({
      totals: totalResults[0] || {
        totalQuejas: 0,
        totalSugerencias: 0,
        totalQuejasAbiertas: 0,
        totalQuejasCerradas: 0,
        totalSugerenciasAbiertas: 0,
        totalSugerenciasCerradas: 0
      },
      opinions: opinionResults || []
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json({ message: "Error al obtener los datos" }, { status: 500 });
  }
}
