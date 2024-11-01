// Importamos el paquete NextResponse para manejar las respuestas HTTP en Next.js
import { NextResponse } from "next/server";
// Importamos la librería mysql2/promise para manejar la conexión a la base de datos
import mysql from "mysql2/promise";

// Definimos la configuración de la conexión a la base de datos usando credenciales hardcoded
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com", // URL del host de la base de datos
  user: "admin", // Nombre de usuario de la base de datos
  password: "123456789", // Contraseña de la base de datos
  database: "opinionwebsite", // Nombre de la base de datos
  port: 3306, // Puerto de conexión a la base de datos
};

// Función para obtener todas las opiniones de la base de datos (GET)
export async function GET() {
  try {
    // Creamos una conexión a la base de datos usando la configuración especificada
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Ejecutamos la consulta SQL para obtener todas las opiniones
    const [rows]: any[] = await connection.execute(
      `SELECT opinion_ID, opinion_TypeID, description, comment, status, name, lastName1, cedula, created_At 
      FROM opinion`
    );

    // Verificamos si se encontraron opiniones en la base de datos
    if (rows.length === 0) {
      console.log("No hay opiniones en la base de datos.");
      await connection.end(); // Cerramos la conexión si no hay opiniones
      return NextResponse.json({ message: "No hay opiniones disponibles" }, { status: 200 });
    }

    console.log("Opiniones obtenidas exitosamente:", rows);
    await connection.end(); // Cerramos la conexión una vez obtenidas las opiniones
    return NextResponse.json({ opinions: rows }); // Retornamos las opiniones en formato JSON
  } catch (error) {
    // Manejo de errores en caso de que falle la conexión o la consulta
    if (error instanceof Error) {
      console.error("Error al obtener las opiniones:", error.message);
      return NextResponse.json({ message: "Error al obtener las opiniones", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al obtener opiniones:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para actualizar una opinión en la base de datos (PUT)
export async function PUT(req: Request) {
  try {
    // Obtenemos el cuerpo de la solicitud en formato JSON
    const body = await req.json();
    const { opinion_ID, comment, status } = body; // Desestructuramos los datos necesarios para la actualización

    // Validamos que el ID de la opinión esté presente
    if (!opinion_ID) {
      console.error("Falta el ID de la opinión.");
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    // Creamos una conexión a la base de datos usando la configuración especificada
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Ejecutamos la consulta SQL para actualizar el comentario y el estado de la opinión
    const [result]: any = await connection.execute(
      `UPDATE opinion 
      SET comment = ?, status = ? 
      WHERE opinion_ID = ?`,
      [comment || null, status, opinion_ID] // Asignamos null si el comentario está vacío
    );

    // Verificamos si se actualizó alguna fila en la base de datos
    if (result.affectedRows === 0) {
      console.error("Opinión no encontrada con ID:", opinion_ID);
      await connection.end(); // Cerramos la conexión si no se encuentra la opinión
      return NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 });
    }

    console.log("Opinión actualizada exitosamente con ID:", opinion_ID);
    await connection.end(); // Cerramos la conexión una vez actualizada la opinión
    return NextResponse.json({ message: "Opinión actualizada con éxito" }); // Retornamos mensaje de éxito
  } catch (error) {
    // Manejo de errores en caso de que falle la conexión o la consulta
    if (error instanceof Error) {
      console.error("Error al actualizar la opinión:", error.message);
      return NextResponse.json({ message: "Error al actualizar la opinión", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al actualizar opinión:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}
