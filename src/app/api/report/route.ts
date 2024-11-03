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

    // Consulta SQL para obtener los totales de quejas y sugerencias
    const [totalsResult] = await connection.execute<any>(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND estado = 'Abierta') AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND estado = 'Cerrada') AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND estado = 'Abierta') AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND estado = 'Cerrada') AS totalSugerenciasCerradas
    `);
    const totals = totalsResult[0] as Record<string, any>;

    // Consulta SQL para obtener las opiniones desde la vista `opinion_view`
    const [opinions] = await connection.execute(`
      SELECT opinion_ID AS id, opinion_TypeID AS tipo, description AS descripcion,
             nombre, apellido, cedula, estado, fecha_registro AS fecha
      FROM opinion_view
    `);

    await connection.end();

    return NextResponse.json({ totals, opinions });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end(); // Asegura que la conexión se cierre
    }
  }
}
