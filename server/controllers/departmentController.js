const db = require('../db/db');

exports.createDepartment = async (req, res) => {
  const { division, department_name } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO departments (division, department_name) VALUES (?, ?)',
      [division, department_name]
    );
    res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM departments');
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [department] = await db.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (department.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { division, department_name } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE departments SET division = ?, department_name = ? WHERE id = ?',
      [division, department_name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM departments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
