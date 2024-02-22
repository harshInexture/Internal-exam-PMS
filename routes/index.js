const express = require('express');
const cors = require('cors'); // Import the cors middleware
const db = require('../db'); // Import db from db.js
const router = express.Router();  
const bodyParser = require('body-parser');
// Use the cors middleware
router.use(cors());
router.use(bodyParser.json());

// Define your routes using db as needed
router.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    res.setHeader('Content-Type', 'application/json'); 
    res.json({message:"Get user succesfully",user_data: results});
  });
});

router.post('/signup', (req, res) => {

  const { name, email, user_name, birthday, age, password } = req.body;
  // Assuming 'users' table has 'name' and 'email' columns
  db.query('INSERT INTO users (full_name, email, user_name, birthday, age, password) VALUES (?, ?, ? ,? ,? ,?)', [name, email, user_name, birthday, age, password], (err, result) => {
    console.log("jay shreeram", result);
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).json({ message: err.sqlMessage });
      return;
    }
    res.json({ message: 'User added successfully', id: result.insertId });
  });
});
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the user exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If the user is not found
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // User found, check if password matches
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Password matches, login successful
    res.json({ message: 'Login successful', user });
  });
});
router.get('/get_profile/:id', (req, res) => {
  const userId = req.params.id;

  // Fetch the user profile from the database using the provided ID
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If the user profile is not found
    if (results.length === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // User profile found, return the full response
    const userProfile = results[0];
    res.json({ message: 'User profile retrieved successfully', userProfile });
  });
});

module.exports = router;
