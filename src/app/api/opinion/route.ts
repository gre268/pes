import { NextResponse } from 'next/server'; // Importamos NextResponse para manejar las respuestas en Next.js 13+
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para manejar la conexión a la base de datos

// Función para manejar el método POST (insertar opiniones)
export async function POST(request: Request) {
  try {
    // Parseamos el body para obtener los datos enviados desde el frontend
    const body = await request.json();
    const { details, type, userID, createdDate } = body; // Extraemos los datos necesarios

    // Validación básica de los datos
    if (!details || !userID) {
      return NextResponse.json({ success: false, message: 'Datos faltantes' }, { status: 400 }); // Enviamos un mensaje de error si faltan datos
    }

    // Conexión a la base de datos para insertar la opinión
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Host de la base de datos
      user: 'admin', // Usuario de la base de datos
      password: '123456789', // Contraseña de la base de datos
      database: 'opinionwebsite', // Nombre de la base de datos
      port: 3306, // Puerto de conexión
    });
    console.log('Conexión exitosa para agregar opinión'); // Confirmamos la conexión exitosa

    // Insertamos la nueva opinión en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO opinion (description, opinion_TypeID, user_ID, status_ID, created_At) VALUES (?, ?, ?, ?, ?)',
      [details, type === 'queja' ? 1 : 2, userID, 1, createdDate] // Insertamos los detalles de la opinión, el userID, y la fecha de creación
    );
    console.log('Opinión insertada con éxito:', result); // Mostramos el resultado de la inserción

    await connection.end(); // Cerramos la conexión a la base de datos
    return NextResponse.json({ success: true, message: 'Opinión agregada con éxito' }); // Enviamos un mensaje de éxito
  } catch (err: any) {
    console.error('Error al agregar opinión:', err.message); // Mostramos el error en la consola
    return NextResponse.json({ success: false, message: 'Error al agregar opinión', error: err.message }, { status: 500 }); // Enviamos un mensaje de error en caso de fallo
  }
}
