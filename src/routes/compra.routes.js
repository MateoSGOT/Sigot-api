const { Router } = require('express');
const compraController = require('../controllers/compra.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/',              authenticate, checkPermiso('COMPRAS.LISTAR'),    compraController.getAll);
router.get('/:id',           authenticate, checkPermiso('COMPRAS.CONSULTAR'), compraController.getById);
router.post('/',             authenticate, checkPermiso('COMPRAS.REGISTRAR'), compraController.create);
router.patch('/:id/estado',  authenticate, checkPermiso('COMPRAS.ANULAR'),    compraController.patchEstado);
router.patch('/:id/anular',  authenticate, checkPermiso('COMPRAS.ANULAR'),    compraController.anular);

module.exports = router;
