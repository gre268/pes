import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Temporalmente, hardcodeamos las credenciales para verificar la conexión
      const connection = await mysql.createConnection({
        host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: '123456789',
        database: 'opinionwebsite',
        port: 3306,
      });
      console.log('Conexión exitosa a la base de datos'); // Log para confirmar la conexión a la base de datos

      // Ejecutamos la consulta para buscar el usuario
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE userName = ? AND password = ?',
        [username, password]
      );
      console.log('Consulta ejecutada, filas:', rows); // Log para verificar los resultados de la consulta

      if ((rows as any[]).length > 0) {
        const user = (rows as any[])[0];
        const role = user.role_ID === 1 ? 'admin' : 'regular';
        res.status(200).json({ success: true, role });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      await connection.end();
      console.log('Conexión cerrada correctamente'); // Log para verificar si la conexión se cerró correctamente
    } catch (err) {
      // Verificamos que el error es una instancia de Error y manejamos el mensaje adecuadamente
      if (err instanceof Error) {
        console.error('Error en la función Lambda:', err.message);  // Log para registrar el mensaje de error
        res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Error del servidor' });
      }
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
