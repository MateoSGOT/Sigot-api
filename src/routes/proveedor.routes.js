const { Router } = require('express');
const proveedorController = require('../controllers/proveedor.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('PROVEEDORES.LISTAR'),        proveedorController.getAll);
router.get('/:id',          authenticate, checkPermiso('PROVEEDORES.CONSULTAR'),     proveedorController.getById);
router.post('/',            authenticate, checkPermiso('PROVEEDORES.REGISTRAR'),     proveedorController.create);
router.put('/:id',          authenticate, checkPermiso('PROVEEDORES.EDITAR'),        proveedorController.update);
router.patch('/:id/estado', authenticate, checkPermiso('PROVEEDORES.CAMBIAR_ESTADO'), proveedorController.patchEstado);

module.exports = router;
