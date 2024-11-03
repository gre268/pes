import { NextResponse } from "next/server";
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para la conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Función para obtener el reporte completo (totales y opiniones)
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consultar los totales de quejas y sugerencias
    const [totals]: [any[], any] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    // Consultar todas las opiniones
    const [opinions]: [any[], any] = await connection.execute(`
      SELECT opinion_ID AS id, opinion_type AS tipo, description AS descripcion,
             name AS nombre, lastName1 AS apellido, cedula, status AS estado, fecha_registro AS fecha
      FROM opinion_view
    `);

    await connection.end();

    // Enviar la respuesta con los datos de los totales y opiniones
    return NextResponse.json({ totals: totals[0], opinions });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
