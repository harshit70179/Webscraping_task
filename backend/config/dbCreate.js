const mysql = require("mysql");
const dbConfig = require("./db.config.js");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL server:", err);
    return;
  }
  console.log("Connected to MySQL server");
  // Check if the database exists
  connection.query(`SHOW DATABASES LIKE '${dbConfig.DB}'`, (err, results) => {
    if (err) {
      console.error("Error checking database existence:", err);
      connection.end(); // Close connection
      return;
    }
    if (results.length === 0) {
      // Database does not exist, create it
      console.log(`Database '${dbConfig.DB}' does not exist, creating...`);
      createDatabase(connection);
    } else {
      // Database exists, use it
      console.log(`Database '${dbConfig.DB}' exists, using it.`);
      useDatabase(connection);
    }
  });
});

// Function to create the database
function createDatabase(connection) {
  connection.query(`CREATE DATABASE ${dbConfig.DB}`, (err, results) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log(`Database '${dbConfig.DB}' created successfully.`);
      useDatabase(connection); // Use the newly created database
    }
    connection.end(); // Close connection
  });
}

// Function to use the database and establish final connection
function useDatabase(connection) {
  // Reconnect with the specified database
  connection.changeUser({ database: dbConfig.DB }, (err) => {
    if (err) {
      console.error("Error changing database:", err);
      connection.end(); // Close connection
      return;
    }
    console.log(`Connected to database '${dbConfig.DB}'`);
    // Export the connection for use in other modules
    module.exports = connection;
  });
}
