const { Router } = require('express');
const empleadoController = require('../controllers/empleado.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('EMPLEADOS.LISTAR'),        empleadoController.getAll);
router.get('/:id',          authenticate, checkPermiso('EMPLEADOS.CONSULTAR'),     empleadoController.getById);
router.post('/',            authenticate, checkPermiso('EMPLEADOS.REGISTRAR'),     empleadoController.create);
router.put('/:id',          authenticate, checkPermiso('EMPLEADOS.EDITAR'),        empleadoController.update);
router.patch('/:id/estado', authenticate, checkPermiso('EMPLEADOS.CAMBIAR_ESTADO'), empleadoController.patchEstado);

module.exports = router;
