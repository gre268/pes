// Importing NextResponse to handle responses in Next.js API routes
import { NextResponse } from 'next/server';
// Importing mysql2/promise for database connection handling with promises
import mysql from 'mysql2/promise';

// Database connection configuration with hardcoded credentials for academic purposes
const connectionConfig = {
  host: 'opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com', // Host address
  user: 'admin', // Database username
  password: '123456789', // Database password
  database: 'opinionwebsite', // Database name
  port: 3306, // Connection port
};

// Handler function to retrieve opinion totals from the database
export async function GET() {
  try {
    // Establishing a connection to the database
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Database connection established for fetching report data.");

    // SQL query to calculate various totals based on opinion types and statuses
    const [rows]: [any[], any] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1) AS totalQuejas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2) AS totalSugerencias,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 1) AS totalQuejasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 1 AND status_ID = 2) AS totalQuejasCerradas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 1) AS totalSugerenciasAbiertas,
        (SELECT COUNT(*) FROM opinion WHERE opinion_TypeID = 2 AND status_ID = 2) AS totalSugerenciasCerradas
    `);

    // Closing the database connection
    await connection.end();
    console.log("Report data fetched successfully.");

    // Returning the totals in JSON format
    return NextResponse.json(rows[0]); // Accessing the first row of the result set
  } catch (error) {
    // Error handling for database or query issues
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { message: "Error fetching report data", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
