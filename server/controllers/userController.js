const db = require('../db/db');


// User login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    // Check if the user exists
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];

    // Compare the provided password with the stored plain text password
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // If login is successful, return a success response
    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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