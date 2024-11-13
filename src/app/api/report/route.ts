// Archivo: route.ts
import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from 'mysql2/promise';

// Configuración de conexión a la base de datos
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Definimos los tipos de datos esperados para cada consulta
interface Opinion extends RowDataPacket {
  id: number;
  user_ID: number;
  tipo: number;
  status_ID: number;
  fecha: string;
  descripcion: string;
}

interface User extends RowDataPacket {
  user_ID: number;
  nombre: string;
  apellido: string;
  cedula: string;
}

interface Totals {
  totalQuejas: number;
  totalSugerencias: number;
  totalQuejasAbiertas: number;
  totalQuejasCerradas: number;
  totalSugerenciasAbiertas: number;
  totalSugerenciasCerradas: number;
}

// Función para manejar la solicitud GET y obtener los datos del reporte
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consulta para obtener los datos de la tabla "opinion"
    const [opinions] = await connection.execute(`
      SELECT opinion_ID AS id, user_ID, opinion_TypeID AS tipo, 
             status_ID, created_At AS fecha, description AS descripcion 
      FROM opinion
      ORDER BY opinion_ID ASC
    `) as unknown as [Opinion[], RowDataPacket[]];

    // Consulta para obtener la información de los usuarios
    const [users] = await connection.execute(`
      SELECT user_ID, name AS nombre, lastName1 AS apellido, cedula 
      FROM user
    `) as unknown as [User[], RowDataPacket[]];

    // Consultas para obtener cada total de manera individual
    const [[{ totalQuejas }]] = await connection.execute(`
      SELECT COUNT(*) AS totalQuejas FROM opinion WHERE opinion_TypeID = 1
    `) as unknown as [{ totalQuejas: number }[], RowDataPacket[]];

    const [[{ totalSugerencias }]] = await connection.execute(`
      SELECT COUNT(*) AS totalSugerencias FROM opinion WHERE opinion_TypeID = 2
    `) as unknown as [{ totalSugerencias: number }[], RowDataPacket[]];

    const [[{ totalQuejasAbiertas }]] = await connection.execute(`
      SELECT COUNT(*) AS totalQuejasAbiertas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1
    `) as unknown as [{ totalQuejasAbiertas: number }[], RowDataPacket[]];

    const [[{ totalQuejasCerradas }]] = await connection.execute(`
      SELECT COUNT(*) AS totalQuejasCerradas FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2
    `) as unknown as [{ totalQuejasCerradas: number }[], RowDataPacket[]];

    const [[{ totalSugerenciasAbiertas }]] = await connection.execute(`
      SELECT COUNT(*) AS totalSugerenciasAbiertas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1
    `) as unknown as [{ totalSugerenciasAbiertas: number }[], RowDataPacket[]];

    const [[{ totalSugerenciasCerradas }]] = await connection.execute(`
      SELECT COUNT(*) AS totalSugerenciasCerradas FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2
    `) as unknown as [{ totalSugerenciasCerradas: number }[], RowDataPacket[]];

    // Consolidar los totales
    const totals: Totals = {
      totalQuejas,
      totalSugerencias,
      totalQuejasAbiertas,
      totalQuejasCerradas,
      totalSugerenciasAbiertas,
      totalSugerenciasCerradas,
    };

    // Combina los resultados de las opiniones con la información de usuario
    const combinedData = opinions.map((opinion) => {
      const user = users.find((u) => u.user_ID === opinion.user_ID) || { nombre: "Desconocido", apellido: "Desconocido", cedula: "Desconocido" };
      return {
        ...opinion,
        nombre: user.nombre,
        apellido: user.apellido,
        cedula: user.cedula,
        estado: opinion.status_ID === 1 ? "Abierto" : "Cerrado",
      };
    });

    await connection.end();

    return NextResponse.json({ totals, opinions: combinedData });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
