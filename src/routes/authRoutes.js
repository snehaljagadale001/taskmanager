const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers
} = require('../controllers/authController');

const {
  registerRules,
  loginRules,
  validate
} = require('../validators/authValidator');

const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public Routes
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

// Protected Routes
router.get('/profile', auth, getProfile);

// Admin Only Route
router.get('/users', auth, role('admin'), getAllUsers);

module.exports = router;