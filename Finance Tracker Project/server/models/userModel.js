const db = require('./db');

exports.findUserByUsername = async (username) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

exports.createUser = async (username, email, hashedPassword) => {
  try {
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

exports.findUserById = async (id) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};


