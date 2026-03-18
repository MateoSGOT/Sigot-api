const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermiso } = require('../middlewares/checkPermiso');

const router = Router();

router.get('/repuestos', authenticate, checkPermiso('DASHBOARD.VER_STOCK'),     dashboardController.getRepuestos);
router.get('/compras',   authenticate, checkPermiso('DASHBOARD.VER_COMPRAS'),   dashboardController.getCompras);
router.get('/servicios', authenticate, checkPermiso('DASHBOARD.VER_SERVICIOS'), dashboardController.getServicios);
router.get('/empleados', authenticate, checkPermiso('DASHBOARD.VER_EMPLEADOS'), dashboardController.getEmpleados);

module.exports = router;
