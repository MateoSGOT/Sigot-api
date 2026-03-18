const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.post('/login',             authController.login);
router.post('/registro',          authController.registro);
router.post('/logout',            authenticate, authController.logout);
router.post('/recuperar-password', authController.recuperarPassword);

module.exports = router;
