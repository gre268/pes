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
interface OpinionData {
  id: number;
  user_ID: number;
  tipo: string;         // "Queja" o "Sugerencia"
  estado: string;       // "Abierto" o "Cerrado"
  descripcion: string;
  fecha: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

// Función para manejar la solicitud GET y obtener los datos del reporte
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos para obtener el reporte");

    // Consulta para obtener los datos de la tabla "opinion" con sus campos requeridos
    const [opinions] = await connection.execute<RowDataPacket[]>(`
      SELECT o.opinion_ID AS id, o.user_ID, o.opinion_TypeID, o.status_ID,
             o.created_At AS fecha, o.description AS descripcion
      FROM opinion o
      ORDER BY o.opinion_ID ASC
    `);

    // Consulta para obtener el estado de cada opinión según `status_ID`
    const [statuses] = await connection.execute<RowDataPacket[]>(`
      SELECT status_ID, status
      FROM status
    `);

    // Consulta para obtener la información del usuario (nombre, apellido, cédula) basado en `user_ID`
    const [users] = await connection.execute<RowDataPacket[]>(`
      SELECT user_ID, name AS nombre, lastName1 AS apellido, cedula
      FROM user
    `);

    // Mapea los estados en un objeto para acceso rápido por `status_ID`
    const statusMap = Object.fromEntries(statuses.map((status) => [status.status_ID, status.status]));

    // Mapea los usuarios en un objeto para acceso rápido por `user_ID`
    const userMap = Object.fromEntries(users.map((user) => [user.user_ID, user]));

    // Procesa cada opinión para asignar datos correctos
    const processedOpinions: OpinionData[] = opinions.map((opinion) => {
      const tipo = opinion.opinion_TypeID === 1 ? "Queja" : "Sugerencia";
      const estado = statusMap[opinion.status_ID] || "Desconocido";
      const user = userMap[opinion.user_ID] || { nombre: "Desconocido", apellido: "Desconocido", cedula: "Desconocido" };

      return {
        id: opinion.id,
        user_ID: opinion.user_ID,
        tipo,
        estado,
        descripcion: opinion.descripcion,
        fecha: new Date(opinion.fecha).toLocaleDateString("es-ES"),
        nombre: user.nombre,
        apellido: user.apellido,
        cedula: user.cedula,
      };
    });

    await connection.end();

    return NextResponse.json({ opinions: processedOpinions });
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener el reporte", error: String(error) },
      { status: 500 }
    );
  }
}
