const { Router } = require('express');
const novedadController = require('../controllers/novedad.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/',    novedadController.getAll);
router.get('/:id', novedadController.getById);
router.post('/',   novedadController.create);
router.put('/:id', novedadController.update);

module.exports = router;
