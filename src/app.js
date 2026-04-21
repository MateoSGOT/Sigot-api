const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NotFoundError } = require('./errors/httpErrors');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes     = require('./routes/auth.routes');
const rolRoutes      = require('./routes/rol.routes');
const clienteRoutes  = require('./routes/cliente.routes');
const vehiculoRoutes  = require('./routes/vehiculo.routes');
const empleadoRoutes         = require('./routes/empleado.routes');
const categoriaRepuestoRoutes = require('./routes/categoriaRepuesto.routes');
const repuestoRoutes          = require('./routes/repuesto.routes');
const proveedorRoutes         = require('./routes/proveedor.routes');
const compraRoutes            = require('./routes/compra.routes');
const servicioRoutes          = require('./routes/servicio.routes');
const agendaRoutes            = require('./routes/agenda.routes');
const ordenRoutes             = require('./routes/orden.routes');
const novedadRoutes           = require('./routes/novedad.routes');
const dashboardRoutes         = require('./routes/dashboard.routes');
const catalogoRoutes          = require('./routes/catalogo.routes');
const permisosRoutes        = require('./routes/permisos.routes');

const app = express();

app.set('json replacer', (key, value) => {
  if (value !== null && typeof value === 'object' && value.constructor?.name === 'Decimal') {
    return Number(value);
  }
  if (key === 'Estado' && typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return value;
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK', app: 'SIGOT API' }));

app.use('/api/auth',      authRoutes);
app.use('/api/roles',     rolRoutes);
app.use('/api/clientes',  clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/empleados',          empleadoRoutes);
app.use('/api/categoria-repuestos', categoriaRepuestoRoutes);
app.use('/api/repuestos',           repuestoRoutes);
app.use('/api/proveedores',         proveedorRoutes);
app.use('/api/compras',             compraRoutes);
app.use('/api/servicios',           servicioRoutes);
app.use('/api/agenda',              agendaRoutes);
app.use('/api/ordenes',             ordenRoutes);
app.use('/api/novedades',           novedadRoutes);
app.use('/api/dashboard',           dashboardRoutes);
app.use('/api/catalogos',           catalogoRoutes);
app.use('/api/permisos',           permisosRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
