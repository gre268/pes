// pages/api/testInsert.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Conectamos a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });
    console.log('Conexión exitosa a la base de datos'); // Log para confirmar la conexión a la base de datos

    // Ejecutamos la inserción de prueba
    const [result] = await connection.execute(
      'INSERT INTO opinion (description) VALUES (?)',
      ['Esta es una opinión de prueba']
    );
    console.log('Inserción realizada, ID:', result); // Log para verificar la inserción

    // Cerramos la conexión a la base de datos
    await connection.end();
    console.log('Conexión cerrada correctamente'); // Log para verificar si la conexión se cerró correctamente

    // Respondemos con éxito
    res.status(200).json({ success: true, message: 'Opinión insertada con éxito' });
  } catch (err) {
    // Verificamos que el error es una instancia de Error y manejamos el mensaje adecuadamente
    if (err instanceof Error) {
      console.error('Error al insertar la opinión:', err.message);  // Log para registrar el mensaje de error
      res.status(500).json({ success: false, message: 'Error al insertar la opinión', error: err.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al insertar la opinión' });
    }
  }
}
