// Archivo: route.ts
import { NextResponse } from "next/server"; // Importa NextResponse para manejar respuestas de la API
import mysql from 'mysql2/promise'; // Importa mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Función para manejar la solicitud GET y obtener los datos del reporte
export async function GET() {
  try {
    // Crea una conexión a la base de datos
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Realiza consultas SQL para obtener los totales de quejas y sugerencias (abiertas y cerradas)
    const [totalQuejas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejas FROM opinion WHERE opinion_TypeID = 1`);
    const [totalSugerencias] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerencias FROM opinion WHERE opinion_TypeID = 2`);
    const [totalQuejasAbiertas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejasAbiertas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1`);
    const [totalQuejasCerradas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejasCerradas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2`);
    const [totalSugerenciasAbiertas] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerenciasAbiertas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1`);
    const [totalSugerenciasCerradas] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerenciasCerradas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2`);

    // Almacena los totales en un objeto
    const totals = {
      totalQuejas: totalQuejas[0].totalQuejas,
      totalSugerencias: totalSugerencias[0].totalSugerencias,
      totalQuejasAbiertas: totalQuejasAbiertas[0].totalQuejasAbiertas,
      totalQuejasCerradas: totalQuejasCerradas[0].totalQuejasCerradas,
      totalSugerenciasAbiertas: totalSugerenciasAbiertas[0].totalSugerenciasAbiertas,
      totalSugerenciasCerradas: totalSugerenciasCerradas[0].totalSugerenciasCerradas,
    };

    // Realiza una consulta SQL para obtener detalles de todas las opiniones
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

    // Devuelve los datos en formato JSON para que el frontend los consuma
    return NextResponse.json({ totals, opinions });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
