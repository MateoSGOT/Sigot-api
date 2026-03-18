const { Router } = require('express');
const vehiculoController = require('../controllers/vehiculo.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('VEHICULOS.LISTAR'),        vehiculoController.getAll);
router.get('/:id',          authenticate, checkPermiso('VEHICULOS.CONSULTAR'),     vehiculoController.getById);
router.post('/',            authenticate, checkPermiso('VEHICULOS.REGISTRAR'),     vehiculoController.create);
router.put('/:id',          authenticate, checkPermiso('VEHICULOS.EDITAR'),        vehiculoController.update);
router.patch('/:id/estado', authenticate, checkPermiso('VEHICULOS.CAMBIAR_ESTADO'), vehiculoController.patchEstado);

module.exports = router;
