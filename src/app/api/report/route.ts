// Archivo: route.ts
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

// Handler para obtener el reporte completo (totales y opiniones)
export async function GET() {
  let connection;

  try {
    // Establecemos la conexión a la base de datos
    connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos");

    // Consulta SQL para obtener los totales de quejas y sugerencias directamente desde la tabla `opinion`
    const [totalsResult] = await connection.execute<any>(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);
    const totals = totalsResult[0] as Record<string, any>;

    // Consulta SQL para obtener todas las opiniones con detalles del usuario y estado
    const [opinions] = await connection.execute(`
      SELECT o.opinion_ID AS id, o.opinion_TypeID AS tipo, o.description AS descripcion,
             u.name AS nombre, u.lastName1 AS apellido, u.cedula,
             s.status AS estado, o.created_At AS fecha
      FROM opinion o
      LEFT JOIN user u ON o.user_ID = u.user_ID
      LEFT JOIN status s ON o.status_ID = s.status_ID
      ORDER BY o.opinion_ID ASC
    `);

    // Cerramos la conexión a la base de datos
    await connection.end();

    // Devolvemos los datos en formato JSON
    return NextResponse.json({ totals, opinions });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end(); // Aseguramos que la conexión se cierre
    }
  }
}
