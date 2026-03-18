const { Router } = require('express');
const { prisma } = require('../config/db');

const router = Router();

// Tipos de documento — sin auth, se usan en formularios de registro
router.get('/tipos-documento', async (req, res, next) => {
  try {
    const data = await prisma.tipo_Doc.findMany({
      select: { Id_TipoDoc: true, Nombre: true },
      orderBy: { Nombre: 'asc' },
    });
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
});

// Marcas de vehículo — sin auth, se usan en formularios de vehículo
router.get('/marcas', async (req, res, next) => {
  try {
    const data = await prisma.marca.findMany({
      select: { Id_Marca: true, Nombre: true },
      orderBy: { Nombre: 'asc' },
    });
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
