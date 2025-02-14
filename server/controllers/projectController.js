const db = require('../db/db');

exports.createProject = async (req, res) => {
  const { project_name, project_description } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO projects (project_name, project_description) VALUES (?, ?)',
      [project_name, project_description]
    );
    res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { project_name, project_description } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE projects SET project_name = ?, project_description = ? WHERE id = ?',
      [project_name, project_description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
