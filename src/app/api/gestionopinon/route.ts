import { NextResponse } from 'next/server'; // Importamos NextResponse para manejar las respuestas en Next.js
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Función GET para obtener todas las opiniones desde la base de datos
export async function GET() {
  try {
    // Conectamos a la base de datos usando mysql2/promise con credenciales hardcoded
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección de la base de datos
      user: 'admin', // Usuario de la base de datos
      password: '123456789', // Contraseña de la base de datos
      database: 'opinionwebsite', // Nombre de la base de datos
      port: 3306, // Puerto de conexión
    });

    // Ejecutamos la consulta para obtener todas las opiniones
    const [rows] = await connection.execute('SELECT * FROM opinion');
    
    // Cerramos la conexión a la base de datos
    await connection.end();

    // Devolvemos las opiniones obtenidas en formato JSON
    return NextResponse.json({ opinions: rows });
  } catch (error) {
    // Especificamos que error es de tipo Error para acceder a la propiedad message
    const errorMessage = (error as Error).message;
    
    // Retornamos un mensaje de error en formato JSON en caso de fallo
    return NextResponse.json(
      { success: false, message: 'Error al obtener opiniones', error: errorMessage },
      { status: 500 }
    );
  }
}

// Función PUT para actualizar el comentario y estado de una opinión
export async function PUT(request: Request) {
  try {
    // Parseamos el body para obtener los datos enviados desde el frontend
    const body = await request.json();
    const { opinion_ID, comment, status } = body; // Extraemos el ID de la opinión, comentario y estado

    // Conexión a la base de datos utilizando mysql2/promise
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Dirección de la base de datos
      user: 'admin', // Usuario de la base de datos
      password: '123456789', // Contraseña de la base de datos
      database: 'opinionwebsite', // Nombre de la base de datos
      port: 3306, // Puerto de conexión
    });

    // Ejecutamos la consulta para actualizar el comentario y estado de la opinión
    const [result] = await connection.execute(
      'UPDATE opinion SET comment = ?, status_ID = ? WHERE opinion_ID = ?',
      [comment, status === 'Abierto' ? 1 : 2, opinion_ID] // Usamos 1 para "Abierto" y 2 para "Cerrado"
    );

    // Cerramos la conexión a la base de datos
    await connection.end();

    // Retornamos una respuesta de éxito en formato JSON
    return NextResponse.json({ success: true, message: 'Opinión actualizada' });
  } catch (error) {
    // Especificamos que error es de tipo Error para acceder a la propiedad message
    const errorMessage = (error as Error).message;

    // Retornamos un mensaje de error en formato JSON en caso de fallo
    return NextResponse.json(
      { success: false, message: 'Error al actualizar la opinión', error: errorMessage },
      { status: 500 }
    );
  }
}
