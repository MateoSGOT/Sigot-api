const dashboardModel = require('../models/dashboard.model');

const getRepuestos = async (req, res, next) => {
  try {
    const data = await dashboardModel.getRepuestos();
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
};

const getCompras = async (req, res, next) => {
  try {
    const data = await dashboardModel.getCompras();
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
};

const getServicios = async (req, res, next) => {
  try {
    const data = await dashboardModel.getServicios();
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
};

const getEmpleados = async (req, res, next) => {
  try {
    const data = await dashboardModel.getEmpleados();
    res.json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRepuestos, getCompras, getServicios, getEmpleados };
