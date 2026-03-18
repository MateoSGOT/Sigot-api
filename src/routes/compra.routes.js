const { Router } = require('express');
const compraController = require('../controllers/compra.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             compraController.getAll);
router.get('/:id',          compraController.getById);
router.post('/',            compraController.create);
router.patch('/:id/estado', compraController.patchEstado);

module.exports = router;
