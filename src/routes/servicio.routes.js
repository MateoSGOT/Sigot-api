const { Router } = require('express');
const servicioController = require('../controllers/servicio.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             servicioController.getAll);
router.get('/:id',          servicioController.getById);
router.post('/',            servicioController.create);
router.put('/:id',          servicioController.update);
router.patch('/:id/estado', servicioController.patchEstado);

module.exports = router;
