const { Router } = require('express');
const categoriaRepuestoController = require('../controllers/categoriaRepuesto.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('CATEGORIAS.LISTAR'),        categoriaRepuestoController.getAll);
router.get('/:id',          authenticate, checkPermiso('CATEGORIAS.CONSULTAR'),     categoriaRepuestoController.getById);
router.post('/',            authenticate, checkPermiso('CATEGORIAS.REGISTRAR'),     categoriaRepuestoController.create);
router.put('/:id',          authenticate, checkPermiso('CATEGORIAS.EDITAR'),        categoriaRepuestoController.update);
router.patch('/:id/estado', authenticate, checkPermiso('CATEGORIAS.CAMBIAR_ESTADO'), categoriaRepuestoController.patchEstado);

module.exports = router;
