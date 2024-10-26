import { NextResponse } from 'next/server'; // Importamos NextResponse para manejar las respuestas
import mysql from 'mysql2/promise'; // Importamos mysql2/promise para la conexión a la base de datos

// Definimos la función que manejará el método POST para la API de login
export async function POST(request: Request) {
  try {
    // Parseamos el cuerpo de la solicitud para obtener los datos enviados (usuario y contraseña)
    const body = await request.json();
    const { username, password } = body; // Obtenemos username y password del cuerpo de la solicitud

    // Conexión a la base de datos utilizando las credenciales hardcodeadas para esta prueba
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password: '123456789',
      database: 'opinionwebsite',
      port: 3306,
    });
    console.log('Conexión exitosa a la base de datos'); // Log para confirmar la conexión a la base de datos

    // Ejecutamos la consulta para buscar el usuario y validar la contraseña
    const [rows] = await connection.execute(
      'SELECT * FROM user WHERE userName = ? AND password = ?',
      [username, password] // Reemplazamos los placeholders con los valores ingresados por el usuario
    );
    console.log('Consulta ejecutada, filas:', rows);  // Log para verificar los resultados de la consulta

    // Si el usuario fue encontrado en la base de datos
    if ((rows as any[]).length > 0) {
      const user = (rows as any[])[0]; // Obtenemos el primer registro encontrado
      const role = user.role_ID === 1 ? 'admin' : 'regular'; // Verificamos si el usuario es admin o regular
      console.log('Usuario encontrado, rol:', role); // Log para confirmar el rol del usuario

      await connection.end(); // Cerramos la conexión a la base de datos
      console.log('Conexión a la base de datos cerrada'); // Log para confirmar que la conexión se cerró correctamente

      // Enviamos una respuesta exitosa con el rol del usuario
      return NextResponse.json({ success: true, role });
    } else {
      console.log('Credenciales incorrectas'); // Log si las credenciales no coinciden con ningún registro
      // Enviamos una respuesta de error si las credenciales son incorrectas
      return NextResponse.json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 });
    }
  } catch (err: any) {
    // En caso de error, lo capturamos y enviamos una respuesta de error
    console.error('Error en la conexión o consulta:', err.message);  // Log para registrar el error

    // Enviamos una respuesta con el mensaje de error
    return NextResponse.json({ success: false, message: 'Error del servidor', error: err.message }, { status: 500 });
  }
}
