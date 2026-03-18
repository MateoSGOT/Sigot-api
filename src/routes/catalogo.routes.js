const { Router } = require('express');
const { getPool, sql } = require('../config/db');

const router = Router();

// Tipos de documento — sin auth, se usan en formularios de registro
router.get('/tipos-documento', async (req, res, next) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT Id_TipoDoc, Nombre FROM Tipo_Doc ORDER BY Nombre');
    res.json({ status: 'ok', data: result.recordset });
  } catch (err) {
    next(err);
  }
});

// Marcas de vehículo — sin auth, se usan en formularios de vehículo
router.get('/marcas', async (req, res, next) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT Id_Marca, Nombre FROM Marca ORDER BY Nombre');
    res.json({ status: 'ok', data: result.recordset });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
