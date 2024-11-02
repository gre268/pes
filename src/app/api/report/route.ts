import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js
import mysql from "mysql2/promise"; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos con credenciales hardcoded
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección del host de la base de datos RDS
  user: 'admin', // Usuario para la base de datos
  password: '123456789', // Contraseña para la base de datos
  database: 'opinionwebsite', // Nombre de la base de datos
  port: 3306, // Puerto de conexión a la base de datos
};

// Función para obtener los totales y opiniones desde la base de datos (GET)
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig); // Creamos una conexión a la base de datos
    console.log("Conexión exitosa para obtener datos");

    // Consulta para obtener los totales de quejas y sugerencias
    const [totals]: any[] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    // Consulta para obtener las opiniones desde la vista 'opinion_view'
    const [opinions]: any[] = await connection.execute(`
      SELECT opinion_ID, opinion_type, description, name, lastName1, cedula, fecha_registro, estado
      FROM opinion_view
    `);

    await connection.end(); // Cerramos la conexión
    console.log("Datos obtenidos exitosamente");

    // Devolvemos los totales y las opiniones
    return NextResponse.json({ totals: totals[0], opinions }); // Enviamos los datos en formato JSON
  } catch (error) {
    console.error("Error al obtener los datos:", error); // Log del error en la consola
    return NextResponse.json({ message: "Error al obtener los datos" }, { status: 500 });
  }
}
