const { Router } = require('express');
const empleadoController = require('../controllers/empleado.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             empleadoController.getAll);
router.get('/:id',          empleadoController.getById);
router.post('/',            empleadoController.create);
router.put('/:id',          empleadoController.update);
router.patch('/:id/estado', empleadoController.patchEstado);

module.exports = router;
