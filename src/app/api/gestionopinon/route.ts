import { NextResponse } from "next/server"; // Importamos NextResponse para manejar las respuestas de la API.
import mysql from "mysql2/promise"; // Importamos mysql2/promise para usar Promises con la conexión a la base de datos.

// Configuración de conexión a la base de datos MySQL
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com", // Host de la base de datos
  user: "admin", // Usuario para conectar a la base de datos
  password: "123456789", // Contraseña del usuario
  database: "opinionwebsite", // Nombre de la base de datos
  port: 3306, // Puerto por defecto para MySQL
};

// Permitir solicitudes OPTIONS para gestionar preflight (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: { "Allow": "GET, PUT, OPTIONS" } }); // Respuesta que indica que los métodos GET, PUT y OPTIONS están permitidos.
}

// Función para manejar solicitudes GET: obtener todas las opiniones
export async function GET() {
  try {
    // Creamos una conexión a la base de datos MySQL usando la configuración anterior
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Consulta SQL para obtener todas las opiniones y detalles necesarios
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

    // Cerramos la conexión a la base de datos
    await connection.end();

    // Respondemos con las opiniones obtenidas en formato JSON
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    console.error("Error al obtener las opiniones:", error);
    // Si ocurre un error, devolvemos un mensaje de error con un estado 500
    return NextResponse.json(
      { message: "Error al obtener las opiniones", error: String(error) },
      { status: 500 }
    );
  }
}

// Función para manejar solicitudes PUT: actualizar una opinión específica
export async function PUT(req: Request) {
  try {
    // Parseamos el cuerpo de la solicitud para obtener los datos enviados
    const body = await req.json();
    const { opinion_ID, comment, status } = body; // Extraemos el ID de la opinión, comentario y estado

    // Validación simple para asegurarse de que se proporciona un ID de opinión
    if (!opinion_ID) {
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    // Creamos una conexión a la base de datos MySQL usando la configuración anterior
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Actualizamos el estado de la opinión en la tabla correspondiente
    await connection.execute(
      `UPDATE opinion SET status_ID = ? WHERE opinion_ID = ?`,
      [status === "Abierto" ? 1 : 2, opinion_ID]
    );

    // Si se proporciona un comentario, lo actualizamos o insertamos en la tabla de comentarios
    if (comment) {
      await connection.execute(
        `INSERT INTO comment (opinion_ID, detail) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE detail = ?`,
        [opinion_ID, comment, comment]
      );
    }

    // Cerramos la conexión a la base de datos
    await connection.end();

    // Respondemos con un mensaje indicando que la opinión fue actualizada exitosamente
    return NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la opinión:", error);
    // Si ocurre un error, devolvemos un mensaje de error con un estado 500
    return NextResponse.json(
      { message: "Error al actualizar la opinión", error: String(error) },
      { status: 500 }
    );
  }
}
