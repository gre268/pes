const mysql = require('mysql2/promise');

// Configuramos los detalles de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,      // Esto debería estar en tu archivo .env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión exitosa a la base de datos');

        // Realiza una consulta de prueba
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Resultado de la consulta:', rows);

        await connection.end();
    } catch (error) {
        console.error('Error en la conexión:', error);
    }
}

// Ejecutamos la función para probar la conexión
testConnection();
