const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'P@ssw0rd123',
  database: 'parag_db1',
  connectionLimit: 10,
});

app.use(bodyParser.json());

// Endpoint to store XPath data in the database
app.post('/storexpath', (req, res) => {
  const { xpath } = req.body;

  const sql = 'INSERT INTO xpaths (xpath) VALUES (?)';
  pool.query(sql, [xpath], (err, result) => {
    if (err) {
      console.error('Error inserting XPath data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('XPath data inserted successfully.');
      res.json({ message: 'XPath data inserted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
