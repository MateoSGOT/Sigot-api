const { Router } = require('express');
const ordenController = require('../controllers/orden.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',               authenticate, checkPermiso('ORDENES.LISTAR'),        ordenController.getAll);
router.get('/:id',            authenticate, checkPermiso('ORDENES.CONSULTAR'),     ordenController.getById);
router.put('/:id',            authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.update);
router.patch('/:id/estado',   authenticate, checkPermiso('ORDENES.CAMBIAR_ESTADO'), ordenController.patchEstado);
router.post('/:id/servicios', authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addServicio);
router.post('/:id/repuestos', authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addRepuesto);

module.exports = router;
