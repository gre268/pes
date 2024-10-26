import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Inicio de la función API login'); // Log para saber si la función se ejecuta

  if (req.method === 'POST') {
    const { username, password } = req.body;
    console.log('Usuario recibido:', username);  // Log para verificar que los datos están llegando

    try {
      // Usamos credenciales hardcodeadas para la conexión a la base de datos
      const connection = await mysql.createConnection({
        host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: '123456789',
        database: 'opinionwebsite',
        port: 3306,
      });
      console.log('Conexión exitosa a la base de datos');

      // Ejecutamos la consulta para buscar el usuario
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE userName = ? AND password = ?',
        [username, password]
      );
      console.log('Consulta ejecutada:', rows);  // Log para verificar los resultados

      if ((rows as any[]).length > 0) {
        const user = (rows as any[])[0];
        const role = user.role_ID === 1 ? 'admin' : 'regular';
        console.log('Usuario encontrado, rol:', role); // Log para confirmar el usuario y rol

        res.status(200).json({ success: true, role });
      } else {
        console.log('Credenciales incorrectas');  // Log si las credenciales son incorrectas
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      await connection.end();
      console.log('Conexión a la base de datos cerrada');
    } catch (err: any) {  // Cambiamos a `any` para manejar el error
      // Verificamos que el error sea una instancia de Error
      if (err instanceof Error) {
        console.error('Error en la conexión o consulta:', err.message);  // Log para errores de conexión o consulta
        res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Error desconocido' });
      }
    }
  } else {
    console.log('Método no permitido:', req.method);  // Log si el método no es POST
    res.status(405).json({ message: 'Método no permitido' });
  }
}
