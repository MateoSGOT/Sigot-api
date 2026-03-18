const { Router } = require('express');
const vehiculoController = require('../controllers/vehiculo.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',            vehiculoController.getAll);
router.get('/:id',         vehiculoController.getById);
router.post('/',           vehiculoController.create);
router.put('/:id',         vehiculoController.update);
router.patch('/:id/estado', vehiculoController.patchEstado);

module.exports = router;
