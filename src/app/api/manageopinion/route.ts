import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js
import mysql from "mysql2/promise"; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos usando credenciales hardcoded para fines académicos
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com", // Host de la base de datos RDS
  user: "admin", // Usuario de la base de datos
  password: "123456789", // Contraseña de la base de datos
  database: "opinionwebsite", // Nombre de la base de datos
  port: 3306, // Puerto de conexión
};

// Función para obtener todas las opiniones de la vista `opinion_view` (GET)
export async function GET() {
  try {
    // Conectamos a la base de datos
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Ejecutamos la consulta SQL para obtener todas las opiniones de la vista `opinion_view`
    const [rows]: [any[], any] = await connection.execute(`
      SELECT 
        opinion_ID, 
        opinion_TypeID, 
        opinion_type, 
        description, 
        comment, 
        estado, 
        nombre, 
        apellido, 
        cedula, 
        fecha_registro 
      FROM opinion_view
    `);

    if (rows.length === 0) {
      console.log("No hay opiniones en la base de datos.");
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ opinions: [], message: "No hay opiniones disponibles" }, { status: 200 });
    }

    console.log("Opiniones obtenidas exitosamente:", rows);
    await connection.end(); // Cerramos la conexión
    return NextResponse.json({ opinions: rows, message: "Opiniones cargadas correctamente" }); // Enviamos las opiniones obtenidas
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener las opiniones:", error.message); // Log de error detallado
      return NextResponse.json({ message: "Error al obtener las opiniones", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al obtener opiniones:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// Función para actualizar una opinión por su ID en `opinion_view` (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Parseamos el cuerpo de la solicitud para obtener los datos enviados
    const { opinion_ID, comment, estado } = body; // Desestructuramos los datos necesarios para la actualización

    if (!opinion_ID) {
      console.error("Falta el ID de la opinión."); // Log de error si falta el ID
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionConfig); // Creamos una conexión a la base de datos
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Ejecutamos la consulta SQL para actualizar el comentario y el estado de la opinión
    const [result]: [any, any] = await connection.execute(
      "UPDATE opinion SET comment = ?, status_ID = ? WHERE opinion_ID = ?",
      [comment || null, estado === "Abierto" ? 1 : 2, opinion_ID] // Asignamos el estado en función de si es 'Abierto' o 'Cerrado'
    );

    if (result.affectedRows === 0) {
      console.error("Opinión no encontrada con ID:", opinion_ID); // Log de error si no se encuentra la opinión
      await connection.end(); // Cerramos la conexión
      return NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 });
    }

    console.log("Opinión actualizada exitosamente con ID:", opinion_ID); // Log para confirmar la actualización
    await connection.end(); // Cerramos la conexión
    return NextResponse.json({ message: "Opinión actualizada con éxito" }); // Respuesta de éxito
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar la opinión:", error.message);
      return NextResponse.json({ message: "Error al actualizar la opinión", error: error.message }, { status: 500 });
    }
    console.error("Error inesperado al actualizar opinión:", error);
    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}