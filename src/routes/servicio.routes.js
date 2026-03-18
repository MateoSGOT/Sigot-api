const { Router } = require('express');
const servicioController = require('../controllers/servicio.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('SERVICIOS.LISTAR'),        servicioController.getAll);
router.get('/:id',          authenticate, checkPermiso('SERVICIOS.CONSULTAR'),     servicioController.getById);
router.post('/',            authenticate, checkPermiso('SERVICIOS.REGISTRAR'),     servicioController.create);
router.put('/:id',          authenticate, checkPermiso('SERVICIOS.EDITAR'),        servicioController.update);
router.patch('/:id/estado', authenticate, checkPermiso('SERVICIOS.CAMBIAR_ESTADO'), servicioController.patchEstado);

module.exports = router;
