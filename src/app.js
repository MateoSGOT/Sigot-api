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

const app = express();

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

// Ruta no encontrada
app.use((req, res, next) => {
  next(new NotFoundError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
});

// Manejador central de errores
app.use(errorHandler);

module.exports = app;
