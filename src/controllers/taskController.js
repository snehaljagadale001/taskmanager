const { pool } = require('../config/db');

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, status, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, description || '', priority || 'medium', status || 'pending', req.user.id]
    );
    res.status(201).json({ message: 'Task created', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query = `SELECT t.*, u.name as user_name, u.email as user_email 
               FROM tasks t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC`;
      params = [];
    } else {
      query = 'SELECT * FROM tasks WHERE user_id=$1 ORDER BY created_at DESC';
      params = [req.user.id];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT t.*, u.name as user_name FROM tasks t JOIN users u ON t.user_id=u.id WHERE t.id=$1', [id]);
    } else {
      result = await pool.query('SELECT * FROM tasks WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    }
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    let existing;
    if (req.user.role === 'admin') {
      existing = await pool.query('SELECT * FROM tasks WHERE id=$1', [id]);
    } else {
      existing = await pool.query('SELECT * FROM tasks WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    }
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Task not found' });

    const t = existing.rows[0];
    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [title || t.title, description ?? t.description, status || t.status, priority || t.priority, id]
    );
    res.json({ message: 'Task updated', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING id', [id]);
    } else {
      result = await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id', [id, req.user.id]);
    }
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM tasks');
    const byStatus = await pool.query('SELECT status, COUNT(*) as count FROM tasks GROUP BY status');
    const byPriority = await pool.query('SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    res.json({
      totalTasks: parseInt(total.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      byStatus: byStatus.rows,
      byPriority: byPriority.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getStats };