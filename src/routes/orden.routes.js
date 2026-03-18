const { Router } = require('express');
const ordenController = require('../controllers/orden.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',                   ordenController.getAll);
router.get('/:id',                ordenController.getById);
router.put('/:id',                ordenController.update);
router.patch('/:id/estado',       ordenController.patchEstado);
router.post('/:id/servicios',     ordenController.addServicio);
router.post('/:id/repuestos',     ordenController.addRepuesto);

module.exports = router;
