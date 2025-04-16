const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);
router.get('/current-user', authController.getCurrentUser);
router.get('/status', authController.getStatus);

module.exports = router; 