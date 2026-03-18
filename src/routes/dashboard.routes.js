const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/repuestos', dashboardController.getRepuestos);
router.get('/compras',   dashboardController.getCompras);
router.get('/servicios', dashboardController.getServicios);
router.get('/empleados', dashboardController.getEmpleados);

module.exports = router;
