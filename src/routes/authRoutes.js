const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { registerRules, loginRules, validate } = require('../validators/authValidator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/profile', auth, getProfile);
router.get('/users', auth, role('admin'), getAllUsers);

module.exports = router;