const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',  // Remove the port number from here
 // port: 3000,         // Add the port number as a separate property
  user: 'root',       // Replace with your MySQL username
  password: 'P@ssw0rd123',  // Replace with your MySQL password
  database: 'parag_db1',  // Replace with your database name
  connectionLimit: 10, // Adjust this as per your needs
});

// Function to insert employee data into the database
function insertXpaths(xpath) {
  const sql = 'INSERT INTO xpaths (xpath) VALUES (?)';
  pool.query(sql, [xpath], (err, result) => {
    if (err) {
      console.error('Error inserting XPath data:', err);
    } else {
      console.log('XPath data inserted successfully.');
    }
  });
}

module.exports = {
  insertXpaths,
};
