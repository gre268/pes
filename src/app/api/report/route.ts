// Archivo: route.ts
import { NextResponse } from "next/server"; // Importa NextResponse para manejar las respuestas HTTP en Next.js
import mysql from 'mysql2/promise'; // Importa mysql2 para hacer consultas a la base de datos de manera asíncrona

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
    // Crear una conexión a la base de datos
    connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consultas SQL individuales para obtener los totales
    const [totalQuejas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejas FROM opinion WHERE opinion_TypeID = 1`);
    const [totalSugerencias] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerencias FROM opinion WHERE opinion_TypeID = 2`);
    const [totalQuejasAbiertas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejasAbiertas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1`);
    const [totalQuejasCerradas] = await connection.execute<any>(`SELECT COUNT(*) AS totalQuejasCerradas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2`);
    const [totalSugerenciasAbiertas] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerenciasAbiertas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1`);
    const [totalSugerenciasCerradas] = await connection.execute<any>(`SELECT COUNT(*) AS totalSugerenciasCerradas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2`);

    // Combina los resultados de los totales
    const totals = {
      totalQuejas: totalQuejas[0].totalQuejas,
      totalSugerencias: totalSugerencias[0].totalSugerencias,
      totalQuejasAbiertas: totalQuejasAbiertas[0].totalQuejasAbiertas,
      totalQuejasCerradas: totalQuejasCerradas[0].totalQuejasCerradas,
      totalSugerenciasAbiertas: totalSugerenciasAbiertas[0].totalSugerenciasAbiertas,
      totalSugerenciasCerradas: totalSugerenciasCerradas[0].totalSugerenciasCerradas,
    };

    // Consulta SQL para obtener todas las opiniones con sus detalles
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

    // Devuelve los datos en formato JSON para el frontend
    return NextResponse.json({ totals, opinions });
  } catch (error) {
    // Muestra un mensaje de error en caso de fallo
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
