const db = require('../db/db');

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password_hash, email, role_id, department_id, reporting_manager_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash, email, role_id, department_id, reporting_manager_id) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password_hash, email, role_id, department_id, reporting_manager_id]
    );
    res.status(201).json({ id: result.insertId, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password_hash, email, role_id, department_id, reporting_manager_id } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET username = ?, password_hash = ?, email = ?, role_id = ?, department_id = ?, reporting_manager_id = ? WHERE id = ?',
      [username, password_hash, email, role_id, department_id, reporting_manager_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};