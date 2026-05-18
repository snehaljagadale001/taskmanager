const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask, getStats } = require('../controllers/taskController');
const { taskRules, validate } = require('../validators/taskValidator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth);

router.get('/stats', role('admin'), getStats);
router.post('/', taskRules, validate, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', taskRules, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;