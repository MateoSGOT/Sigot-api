const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.post('/login',             authController.login);
router.post('/registro',          authController.registro);
router.post('/logout',            authenticate, authController.logout);
router.post('/recuperar-password', authController.recuperarPassword);

// Endpoint temporal de diagnóstico del mailer — eliminar en producción
router.get('/test-mail', async (req, res) => {
  const { enviarRecuperacionPassword } = require('../utils/mailer');
  const diagnostico = {
    MAIL_USER: process.env.MAIL_USER || '❌ NO DEFINIDO',
    MAIL_PASS: process.env.MAIL_PASS ? '✅ definido (' + process.env.MAIL_PASS.length + ' chars)' : '❌ NO DEFINIDO',
  };
  try {
    await enviarRecuperacionPassword(
      process.env.MAIL_USER || 'test@test.com',
      'Test',
      'tokendetestxxxx'
    );
    res.json({ status: 'ok', mensaje: 'Correo enviado exitosamente', diagnostico });
  } catch (err) {
    res.json({ status: 'error', error: err.message, diagnostico });
  }
});

module.exports = router;
