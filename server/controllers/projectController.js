const db = require("../db/db");

exports.createProject = async (req, res) => {
  const { project_name, project_description } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO projects (project_name, project_description) VALUES (?, ?)",
      [project_name, project_description]
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Project created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM projects");
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveProjectDetails = async (req, res) => {
  try {
      const { startDate, rows, totals } = req.body;
      
      if (!startDate || !rows || !totals) {
          return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const requestData = {
          startDate,
          rows: rows.map(row => ({
              key: row.key,
              project: row.project,
              comments: row.comments,
              days: {
                  day0: row.day0,
                  day1: row.day1,
                  day2: row.day2,
                  day3: row.day3,
                  day4: row.day4,
                  day5: row.day5,
                  day6: row.day6,
              }
          })),
          totals: {
              day0: totals.day0,
              day1: totals.day1,
              day2: totals.day2,
              day3: totals.day3,
              day4: totals.day4,
              day5: totals.day5,
              day6: totals.day6,
          }
      };
      
      console.log('Received Data:', requestData);

      // Process the received data as needed
      
      res.status(200).json({ message: 'Data received successfully', data: requestData });
  } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [project] = await db.query("SELECT * FROM projects WHERE id = ?", [
      id,
    ]);
    if (project.length === 0) {
      return res.status(404).json({ message: "Project not found" });
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
      "UPDATE projects SET project_name = ?, project_description = ? WHERE id = ?",
      [project_name, project_description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
