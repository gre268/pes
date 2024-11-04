import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js.
import mysql from "mysql2/promise"; // Importamos mysql2/promise para manejar la conexión a la base de datos MySQL.

// Configuración de conexión a la base de datos MySQL.
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "123456789",
  database: "opinionwebsite",
  port: 3306,
};

// Función para manejar solicitudes OPTIONS: Responde que permite GET, PUT y OPTIONS.
export async function OPTIONS() {
  return NextResponse.json({}, { headers: { "Allow": "GET, PUT, OPTIONS" } });
}

// Función para manejar solicitudes GET: obtener todas las opiniones.
export async function GET() {
  try {
    // Creamos una conexión a la base de datos MySQL.
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Consulta SQL para obtener todas las opiniones y detalles necesarios.
    const [rows] = await connection.execute(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        ot.type AS opinion_type,
        o.description,
        c.detail AS comment,
        s.status AS estado,
        u.name AS nombre,
        u.lastName1 AS apellido,
        u.cedula,
        o.created_At AS fecha_registro
      FROM opinion AS o
      JOIN user AS u ON o.user_ID = u.user_ID
      JOIN status AS s ON o.status_ID = s.status_ID
      JOIN opinion_type AS ot ON o.opinion_TypeID = ot.opinion_TypeID
      LEFT JOIN comment AS c ON o.opinion_ID = c.opinion_ID
    `);

    // Cerramos la conexión a la base de datos.
    await connection.end();

    // Respondemos con las opiniones obtenidas en formato JSON.
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", error);
    return NextResponse.json(
      { message: "Error al obtener las opiniones", error: String(error) },
      { status: 500 }
    );
  }
}

// Función para manejar solicitudes PUT: actualizar una opinión específica.
export async function PUT(req: Request) {
  try {
    // Parseamos el cuerpo de la solicitud para obtener los datos enviados.
    const body = await req.json();
    const { opinion_ID, comment, status } = body;

    if (!opinion_ID) {
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    // Creamos una conexión a la base de datos MySQL.
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Actualizamos el estado de la opinión en la base de datos.
    await connection.execute(
      `UPDATE opinion SET status_ID = ? WHERE opinion_ID = ?`,
      [status === "Abierto" ? 1 : 2, opinion_ID]
    );

    // Si se proporciona un comentario, lo actualizamos o insertamos en la tabla de comentarios.
    if (comment) {
      await connection.execute(
        `INSERT INTO comment (opinion_ID, detail) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE detail = ?`,
        [opinion_ID, comment, comment]
      );
    }

    // Cerramos la conexión a la base de datos.
    await connection.end();

    // Respondemos con un mensaje de éxito.
    return NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la opinión:", error);
    return NextResponse.json(
      { message: "Error al actualizar la opinión", error: String(error) },
      { status: 500 }
    );
  }
}
