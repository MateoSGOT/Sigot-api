const { Router } = require('express');
const agendaController = require('../controllers/agenda.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('AGENDA.LISTAR'),        agendaController.getAll);
router.get('/:id',          authenticate, checkPermiso('AGENDA.CONSULTAR'),     agendaController.getById);
router.post('/',            authenticate, checkPermiso('AGENDA.REGISTRAR'),     agendaController.create);
router.put('/:id',          authenticate, checkPermiso('AGENDA.EDITAR'),        agendaController.update);
router.patch('/:id/estado', authenticate, checkPermiso('AGENDA.CAMBIAR_ESTADO'), agendaController.patchEstado);
router.post('/:id/orden',   authenticate, checkPermiso('AGENDA.EDITAR'),        agendaController.generarOrden);

module.exports = router;
