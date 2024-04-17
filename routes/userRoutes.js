// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/register', userController.showRegisterForm);
router.get('/logout', isAuthenticated, userController.logoutUser);
router.get('/dashboard', isAuthenticated, userController.dashboard);

module.exports = router;
