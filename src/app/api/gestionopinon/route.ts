import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección del host de la base de datos RDS
  user: 'admin', // Usuario para la base de datos
  password: '123456789', // Contraseña para la base de datos
  database: 'opinionwebsite', // Nombre de la base de datos
  port: 3306, // Puerto de conexión a la base de datos
};

// Función para obtener todas las opiniones de la base de datos (GET)
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig); // Creamos una conexión a la base de datos
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Ejecutamos la consulta SQL para obtener todas las opiniones con sus detalles
    const [rows]: [any[], any] = await connection.execute(`
      SELECT 
        o.opinion_ID,
        o.opinion_TypeID,
        o.description,
        o.comment,
        s.status AS status,
        u.name,
        u.lastName1,
        u.cedula,
        o.created_At 
      FROM opinion AS o
      JOIN user AS u ON o.user_ID = u.user_ID
      JOIN status AS s ON o.status_ID = s.status_ID
    `);

    if (rows.length === 0) {
      console.log("No hay opiniones en la base de datos.");
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ opinions: [] }, { status: 200 }); // Devolvemos un array vacío si no hay opiniones
    }

    console.log("Opiniones obtenidas exitosamente:", rows); // Log para ver las opiniones obtenidas
    await connection.end(); // Cerramos la conexión
    return NextResponse.json({ opinions: rows }); // Enviamos las opiniones obtenidas como respuesta en formato JSON
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener las opiniones:", error.message); // Manejamos el error y mostramos el mensaje
      return NextResponse.json({ message: "Error al obtener las opiniones", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al obtener opiniones:", error); // En caso de un error inesperado
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para actualizar una opinión por su ID (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { opinion_ID, comment, status } = body; // Desestructuramos los datos necesarios para la actualización

    if (!opinion_ID) {
      console.error("Falta el ID de la opinión.");
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig); // Creamos una conexión a la base de datos
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Ejecutamos la consulta SQL para actualizar el comentario y el estado de la opinión
    const [result]: [any, any] = await connection.execute(
      "UPDATE opinion SET comment = ?, status_ID = ? WHERE opinion_ID = ?",
      [comment || null, status === "Abierto" ? 1 : 2, opinion_ID] // Pasamos los valores de los parámetros para la consulta
    );

    // Verificamos si se ha actualizado alguna fila
    if (result.affectedRows === 0) {
      console.error("Opinión no encontrada con ID:", opinion_ID);
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 });
    }

    console.log("Opinión actualizada exitosamente con ID:", opinion_ID); // Log para confirmar actualización
    await connection.end(); // Cerramos la conexión
    return NextResponse.json({ message: "Opinión actualizada con éxito" }); // Respuesta de éxito
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar la opinión:", error.message); // Manejamos el error y mostramos el mensaje
      return NextResponse.json({ message: "Error al actualizar la opinión", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al actualizar opinión:", error); // En caso de un error inesperado
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}
