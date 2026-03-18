const { Router } = require('express');
const agendaController = require('../controllers/agenda.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',               agendaController.getAll);
router.get('/:id',            agendaController.getById);
router.post('/',              agendaController.create);
router.put('/:id',            agendaController.update);
router.patch('/:id/estado',   agendaController.patchEstado);
router.post('/:id/orden',     agendaController.generarOrden);

module.exports = router;
