const express = require('express');
const { authenticateCliente } = require('../middlewares/authenticateCliente');
const portalController = require('../controllers/portal.controller');

const router = express.Router();

router.get('/vehiculos',      authenticateCliente, portalController.getVehiculos);
router.get('/ordenes',        authenticateCliente, portalController.getOrdenes);
router.get('/ordenes/:id',    authenticateCliente, portalController.getOrdenById);
router.put('/perfil',         authenticateCliente, portalController.updatePerfil);

module.exports = router;
