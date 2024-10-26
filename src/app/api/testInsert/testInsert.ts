// pages/api/testInsert.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Temporalmente, usa las credenciales directas para verificar la conexión
    const connection = await mysql.createConnection({
      host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password: '123456789',
      database: 'opinionwebsite',
      port: 3306,
    });
    console.log('Conexión exitosa a la base de datos');

    // Ejecutamos la inserción de prueba
    const [result] = await connection.execute(
      'INSERT INTO opinion (description) VALUES (?)',
      ['Esta es una opinión de prueba']
    );
    console.log('Inserción realizada, ID:', result);

    // Cerramos la conexión a la base de datos
    await connection.end();
    console.log('Conexión cerrada correctamente');

    // Respondemos con éxito
    res.status(200).json({ success: true, message: 'Opinión insertada con éxito' });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error al insertar la opinión:', err.message);
      res.status(500).json({ success: false, message: 'Error al insertar la opinión', error: err.message });
    } else {
      res.status(500).json({ success: false, message: 'Error al insertar la opinión' });
    }
  }
}
