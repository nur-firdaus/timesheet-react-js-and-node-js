const db = require('../db/db');

exports.createTimesheet = async (req, res) => {
    const { user_id, project_id, work_date, hours_worked, task_description, approval_status, approved_by } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO timesheets (user_id, project_id, work_date, hours_worked, task_description, approval_status, approved_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, project_id, work_date, hours_worked, task_description, approval_status, approved_by]
      );
      res.status(201).json({ id: result.insertId, message: 'Timesheet entry created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getAllTimesheets = async (req, res) => {
    try {
      const [timesheets] = await db.query('SELECT * FROM timesheets');
      res.status(200).json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getTimesheetById = async (req, res) => {
    const { id } = req.params;
    try {
      const [timesheet] = await db.query('SELECT * FROM timesheets WHERE id = ?', [id]);
      if (timesheet.length === 0) {
        return res.status(404).json({ message: 'Timesheet entry not found' });
      }
      res.status(200).json(timesheet[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateTimesheet = async (req, res) => {
    const { id } = req.params;
    const { user_id, project_id, work_date, hours_worked, task_description, approval_status, approved_by } = req.body;
    try {
      const [result] = await db.query(
        'UPDATE timesheets SET user_id = ?, project_id = ?, work_date = ?, hours_worked = ?, task_description = ?, approval_status = ?, approved_by = ? WHERE id = ?',
        [user_id, project_id, work_date, hours_worked, task_description, approval_status, approved_by, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Timesheet entry not found' });
      }
      res.status(200).json({ message: 'Timesheet entry updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.deleteTimesheet = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM timesheets WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Timesheet entry not found' });
      }
      res.status(200).json({ message: 'Timesheet entry deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  