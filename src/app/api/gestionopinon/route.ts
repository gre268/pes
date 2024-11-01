import { NextResponse } from "next/server"; // Importamos NextResponse para manejar respuestas en Next.js
import mysql from "mysql2/promise"; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com", // Dirección del host de la base de datos RDS
  user: "admin", // Usuario para la base de datos
  password: "123456789", // Contraseña para la base de datos
  database: "opinionwebsite", // Nombre de la base de datos
  port: 3306, // Puerto de conexión a la base de datos
};

// Función para manejar la solicitud GET y obtener todas las opiniones de la base de datos
export async function GET() {
  try {
    // Creamos una conexión a la base de datos usando la configuración especificada
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener opiniones");

    // Ejecutamos la consulta SQL para obtener todas las opiniones y sus detalles
    const [rows] = await connection.execute(
      `SELECT 
        opinion_ID, 
        opinion_TypeID, 
        description, 
        comment, 
        status AS status, 
        name, 
        lastName1, 
        cedula, 
        created_At 
      FROM opinion`
    );

    // Cerramos la conexión después de ejecutar la consulta
    await connection.end();

    // Devolvemos los datos obtenidos en formato JSON
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    // Manejamos cualquier error ocurrido durante la conexión o consulta
    console.error("Error al obtener las opiniones:", error);
    return NextResponse.json({ message: "Error al obtener las opiniones" }, { status: 500 });
  }
}

// Función para manejar la solicitud PUT y actualizar una opinión en la base de datos
export async function PUT(req: Request) {
  try {
    // Obtenemos el cuerpo de la solicitud en formato JSON
    const body = await req.json();
    const { opinion_ID, comment, status } = body; // Desestructuramos los datos necesarios para la actualización

    // Verificamos que el ID de la opinión esté presente
    if (!opinion_ID) {
      console.error("Falta el ID de la opinión.");
      return NextResponse.json({ message: "Falta el ID de la opinión" }, { status: 400 });
    }

    // Creamos una conexión a la base de datos
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para actualizar opinión");

    // Ejecutamos la consulta SQL para actualizar el comentario y el estado de la opinión especificada
    const [result]: any = await connection.execute(
      `UPDATE opinion 
      SET comment = ?, status = ? 
      WHERE opinion_ID = ?`,
      [comment || null, status, opinion_ID] // Valores de los parámetros para la consulta
    );

    // Cerramos la conexión después de la actualización
    await connection.end();

    // Verificamos si se ha actualizado alguna fila
    if (result && result.affectedRows === 0) {
      console.error("Opinión no encontrada con ID:", opinion_ID);
      return NextResponse.json({ message: "Opinión no encontrada" }, { status: 404 });
    }

    // Devolvemos una respuesta de éxito si se actualizó la opinión correctamente
    return NextResponse.json({ message: "Opinión actualizada con éxito" });
  } catch (error) {
    // Manejamos cualquier error ocurrido durante la actualización
    console.error("Error al actualizar la opinión:", error);
    return NextResponse.json({ message:"Error al actualizar la opinión" }, { status: 500 });
  }
}
