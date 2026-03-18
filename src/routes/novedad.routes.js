const { Router } = require('express');
const novedadController = require('../controllers/novedad.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',    authenticate, checkPermiso('NOVEDADES.LISTAR'),    novedadController.getAll);
router.get('/:id', authenticate, checkPermiso('NOVEDADES.CONSULTAR'), novedadController.getById);
router.post('/',   authenticate, checkPermiso('NOVEDADES.REGISTRAR'), novedadController.create);
router.put('/:id', authenticate, checkPermiso('NOVEDADES.EDITAR'),    novedadController.update);

module.exports = router;
