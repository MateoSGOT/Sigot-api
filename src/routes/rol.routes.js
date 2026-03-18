const { Router } = require('express');
const rolController = require('../controllers/rol.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',             rolController.getAll);
router.get('/:id',          rolController.getById);
router.post('/',            rolController.create);
router.put('/:id',          rolController.update);
router.patch('/:id/estado', rolController.patchEstado);

module.exports = router;
