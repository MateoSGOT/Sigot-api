const { Router } = require('express');
const repuestoController = require('../controllers/repuesto.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/stock',        repuestoController.getStock);   // antes de /:id
router.get('/',             repuestoController.getAll);
router.get('/:id',          repuestoController.getById);
router.post('/',            repuestoController.create);
router.put('/:id',          repuestoController.update);
router.patch('/:id/estado', repuestoController.patchEstado);

module.exports = router;
