const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors module

const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',  // Remove the port number from here
   user: 'root',       // Replace with your MySQL username
  password: 'P@ssw0rd123',  // Replace with your MySQL password 
  database: 'parag_db1',  // Replace with your database name
  connectionLimit: 10, // Adjust this as per your needs
});

// Use CORS middleware
app.use(cors({
  origin: '*' // Change this to your extension's URL in a production environment
}));

// Route to handle incoming XPaths
app.post('/storexpath', express.json(), (req, res) => {
  const { xpath } = req.body;
  console.log('Received XPath:', xpath);

  if (!xpath) {
    return res.status(400).json({ error: 'XPath is required.' });
  }

  const sql = 'INSERT INTO xpaths (xpath) VALUES (?)';
  pool.query(sql, [xpath], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error); // Log the error object
      return res.status(500).json({ error: 'Failed to store the XPath.' });
    }
    console.info(`${results.affectedRows} row inserted`);
    console.log('Inserted into database:', results);
    res.json({ message: 'XPath stored successfully.' });
  });
});

// Add the /xpaths route to fetch table content
app.get('/xpaths', (req, res) => {
  const sql = 'SELECT * FROM xpaths';
  pool.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Failed to fetch data.' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
