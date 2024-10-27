const mysql = require("mysql2/promise");

// Creamos un pool de conexiones con credenciales hardcoded
const pool = mysql.createPool({
  host: "opinionwebsite.cdogwouyu9yy.us-east-1.rds.amazonaws.com", // Host de la base de datos RDS
  user: "admin", // Usuario de la base de datos
  password: "123456789", // Contraseña de la base de datos
  database: "opinionwebsite", // Nombre de la base de datos
  port: 3306, // Puerto predeterminado de MySQL
  connectTimeout: 10000, // Timeout de 10 segundos para conexiones
});

module.exports = { pool }; // Exportamos el pool de conexiones para ser utilizado en otros módulos
