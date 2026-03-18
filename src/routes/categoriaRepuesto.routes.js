const { Router } = require('express');
const categoriaRepuestoController = require('../controllers/categoriaRepuesto.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             categoriaRepuestoController.getAll);
router.get('/:id',          categoriaRepuestoController.getById);
router.post('/',            categoriaRepuestoController.create);
router.put('/:id',          categoriaRepuestoController.update);
router.patch('/:id/estado', categoriaRepuestoController.patchEstado);

module.exports = router;
