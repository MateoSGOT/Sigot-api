const { Router } = require('express');
const ordenController = require('../controllers/orden.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',                       authenticate, checkPermiso('ORDENES.LISTAR'),        ordenController.getAll);
router.get('/:id',                    authenticate, checkPermiso('ORDENES.CONSULTAR'),     ordenController.getById);
router.put('/:id',                    authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.update);
router.patch('/:id/estado',           authenticate, checkPermiso('ORDENES.CAMBIAR_ESTADO'), ordenController.patchEstado);
router.patch('/:id/flujo',            authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.patchFlujo);
router.patch('/:id/manodeobra',       authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.patchManoDeObra);
router.post('/:id/servicios',         authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addServicio);
router.post('/:id/servicios/libre',   authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addServicioLibre);
router.delete('/:id/servicios/:servicioId', authenticate, checkPermiso('ORDENES.EDITAR'), ordenController.deleteServicio);
router.post('/:id/repuestos',         authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addRepuesto);
router.post('/:id/repuestos/libre',   authenticate, checkPermiso('ORDENES.EDITAR'),        ordenController.addRepuestoLibre);
router.delete('/:id/repuestos/:repuestoId', authenticate, checkPermiso('ORDENES.EDITAR'), ordenController.deleteRepuesto);

module.exports = router;
