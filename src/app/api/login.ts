// pages/api/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body; // Extraemos el nombre de usuario y la contraseña del cuerpo de la solicitud

    try {
      // Conectamos a la base de datos 
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
      });

      // Ejecutamos la consulta para buscar el usuario y la contraseña
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE userName = ? AND password = ?',
        [username, password]
      );

      // Si encontramos un usuario, devolvemos éxito
      if ((rows as any[]).length > 0) {
        const user = (rows as any[])[0]; // Obtenemos el primer usuario
        const role = user.role_ID === 1 ? 'admin' : 'regular'; // Determinamos el rol basado en el role_ID

        res.status(200).json({ success: true, role }); // Enviamos la respuesta con el rol del usuario
      } else {
        // Si las credenciales no coinciden, devolvemos un error
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      await connection.end(); // Cerramos la conexión a la base de datos

    } catch (err) {
      // Verificamos que el error es una instancia de Error y manejamos el mensaje adecuadamente
      if (err instanceof Error) {
        res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Error del servidor' });
      }
    }
  } else {
    // Si el método no es POST, devolvemos un error
    res.status(405).json({ message: 'Método no permitido' });
  }
}
