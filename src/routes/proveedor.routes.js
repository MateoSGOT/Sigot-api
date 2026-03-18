const { Router } = require('express');
const proveedorController = require('../controllers/proveedor.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             proveedorController.getAll);
router.get('/:id',          proveedorController.getById);
router.post('/',            proveedorController.create);
router.put('/:id',          proveedorController.update);
router.patch('/:id/estado', proveedorController.patchEstado);

module.exports = router;
