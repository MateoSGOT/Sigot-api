const { Router } = require('express');
const permisosController = require('../controllers/permisos.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.get('/rol/:id_rol',  authenticate, permisosController.getByRol);
router.put('/rol/:id_rol',  authenticate, permisosController.saveByRol);
router.get('/',             authenticate, permisosController.getAll);
router.post('/',            authenticate, permisosController.create);
router.put('/:id',          authenticate, permisosController.update);
router.patch('/:id/estado', authenticate, permisosController.toggleEstado);

module.exports = router;
