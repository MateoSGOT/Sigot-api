const { Router } = require('express');
const clienteController = require('../controllers/cliente.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('CLIENTES.LISTAR'),        clienteController.getAll);
router.get('/:id',          authenticate, checkPermiso('CLIENTES.CONSULTAR'),     clienteController.getById);
router.post('/',            authenticate, checkPermiso('CLIENTES.REGISTRAR'),     clienteController.create);
router.put('/:id',          authenticate, checkPermiso('CLIENTES.EDITAR'),        clienteController.update);
router.patch('/:id/estado', authenticate, checkPermiso('CLIENTES.CAMBIAR_ESTADO'), clienteController.patchEstado);

module.exports = router;
