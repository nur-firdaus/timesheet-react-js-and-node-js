const db = require('../db/db');

exports.createRole = async (req, res) => {
  const { role_name } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO roles (role_name) VALUES (?)',
      [role_name]
    );
    res.status(201).json({ id: result.insertId, message: 'Role created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles');
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [role] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (role.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE roles SET role_name = ? WHERE id = ?',
      [role_name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
