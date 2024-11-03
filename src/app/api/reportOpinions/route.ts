// Importing NextResponse to handle responses in Next.js API routes
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '123456789',
  database: 'opinionwebsite',
  port: 3306,
};

// Handler function to retrieve opinions from the database
export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Database connection established for fetching report data.");

    // Query to fetch all opinions
    const [rows]: [any[], any] = await connection.execute(`
      SELECT opinion_ID AS id, opinion_type AS tipo, description AS descripcion,
             name AS nombre, lastName1 AS apellido, cedula, status AS estado, fecha_registro AS fecha
      FROM opinion_view
    `);

    await connection.end();
    console.log("Opinions fetched successfully.");

    // Ensure we always return an array
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { message: "Error fetching report data", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
