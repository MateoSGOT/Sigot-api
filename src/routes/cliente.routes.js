const { Router } = require('express');
const clienteController = require('../controllers/cliente.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             clienteController.getAll);
router.get('/:id',          clienteController.getById);
router.post('/',            clienteController.create);
router.put('/:id',          clienteController.update);
router.patch('/:id/estado', clienteController.patchEstado);

module.exports = router;
