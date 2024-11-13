// Archivo: route.ts
import { NextResponse } from "next/server"; // Importa NextResponse para manejar las respuestas HTTP en Next.js
import mysql from 'mysql2/promise'; // Importa la biblioteca mysql2 para hacer consultas a la base de datos de manera asíncrona

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección de la base de datos en AWS
  user: 'admin', // Nombre de usuario de la base de datos
  password: '123456789', // Contraseña de la base de datos
  database: 'opinionwebsite', // Nombre de la base de datos
  port: 3306, // Puerto de conexión
};

// Función para manejar la solicitud GET y obtener los datos del reporte
export async function GET() {
  let connection;

  try {
    // Conecta a la base de datos usando la configuración definida
    connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos");

    // Consulta SQL para obtener los totales de quejas y sugerencias
    const [totalsResult] = await connection.execute<any>(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);
    const totals = totalsResult[0] as Record<string, any>; // Almacena los totales en un objeto

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

    // Cierra la conexión a la base de datos
    await connection.end();

    // Devuelve los datos en formato JSON para que el frontend los procese
    return NextResponse.json({ totals, opinions });
  } catch (error) {
    // Muestra un mensaje de error si no se pudo obtener el reporte
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 } // Retorna un código de error 500 si falla la operación
    );
  } finally {
    // Cierra la conexión si está abierta
    if (connection) {
      await connection.end();
    }
  }
}
