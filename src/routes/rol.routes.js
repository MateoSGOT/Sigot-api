const { Router } = require('express');
const rolController = require('../controllers/rol.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',             authenticate, checkPermiso('ROLES.LISTAR'),        rolController.getAll);
router.get('/:id',          authenticate, checkPermiso('ROLES.CONSULTAR'),     rolController.getById);
router.post('/',            authenticate, checkPermiso('ROLES.REGISTRAR'),     rolController.create);
router.put('/:id',          authenticate, checkPermiso('ROLES.EDITAR'),        rolController.update);
router.patch('/:id/estado', authenticate, checkPermiso('ROLES.CAMBIAR_ESTADO'), rolController.patchEstado);

module.exports = router;
