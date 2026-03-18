const { Router } = require('express');
const repuestoController = require('../controllers/repuesto.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/stock',        authenticate, checkPermiso('REPUESTOS.LISTAR'),        repuestoController.getStock);   // antes de /:id
router.get('/',             authenticate, checkPermiso('REPUESTOS.LISTAR'),        repuestoController.getAll);
router.get('/:id',          authenticate, checkPermiso('REPUESTOS.CONSULTAR'),     repuestoController.getById);
router.post('/',            authenticate, checkPermiso('REPUESTOS.REGISTRAR'),     repuestoController.create);
router.put('/:id',          authenticate, checkPermiso('REPUESTOS.EDITAR'),        repuestoController.update);
router.patch('/:id/estado', authenticate, checkPermiso('REPUESTOS.CAMBIAR_ESTADO'), repuestoController.patchEstado);

module.exports = router;
