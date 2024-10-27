import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Función para manejar el método POST (insertar opiniones) y GET (obtener opiniones)
export async function GET() {
  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password: '123456789',
      database: 'opinionwebsite',
      port: 3306,
    });
    console.log('Conexión exitosa para obtener opiniones');

    // Ejecutamos la consulta para obtener todas las opiniones
    const [rows] = await connection.execute('SELECT * FROM opinion');
    console.log('Opiniones obtenidas:', rows);

    await connection.end(); // Cerramos la conexión a la base de datos
    return NextResponse.json({ success: true, opinions: rows });
  } catch (err: any) {
    console.error('Error al obtener opiniones:', err.message);
    return NextResponse.json({ success: false, message: 'Error al obtener opiniones', error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parseamos el body para obtener los datos enviados
    const body = await request.json();
    const { details, type, userID } = body;

    // Validación básica
    if (!details || !userID) {
      return NextResponse.json({ success: false, message: 'Datos faltantes' }, { status: 400 });
    }

    // Conexión a la base de datos para insertar la opinión
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password: '123456789',
      database: 'opinionwebsite',
      port: 3306,
    });
    console.log('Conexión exitosa para agregar opinión');

    // Insertamos la nueva opinión en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO opinion (description, opinion_TypeID, user_ID) VALUES (?, ?, ?)',
      [details, type === 'queja' ? 1 : 2, userID] // Usamos 1 para "queja" y 2 para "sugerencia"
    );
    console.log('Opinión insertada con éxito:', result);

    await connection.end(); // Cerramos la conexión a la base de datos
    return NextResponse.json({ success: true, message: 'Opinión agregada con éxito' });
  } catch (err: any) {
    console.error('Error al agregar opinión:', err.message);
    return NextResponse.json({ success: false, message: 'Error al agregar opinión', error: err.message }, { status: 500 });
  }
}
