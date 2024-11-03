import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección del host de la base de datos RDS
  user: 'admin', // Usuario para la base de datos
  password: '123456789', // Contraseña para la base de datos
  database: 'opinionwebsite', // Nombre de la base de datos
  port: 3306, // Puerto de conexión a la base de datos
};

// Función para obtener los totales desde la base de datos
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig); // Creamos la conexión
    console.log("Conexión exitosa para obtener totales");

    // Consulta SQL para obtener los totales de quejas y sugerencias
    const [rows] = await connection.execute<any[]>(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    await connection.end(); // Cerramos la conexión
    return NextResponse.json(rows[0]); // Enviamos los resultados como JSON
  } catch (error) {
    console.error("Error al obtener los totales:", error); // Captura de errores
    return NextResponse.json({ message: "Error al obtener los totales" }, { status: 500 });
  }
}
