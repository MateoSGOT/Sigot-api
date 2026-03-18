require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const permisos = [
  // ROLES
  { Nombre: 'ROLES.REGISTRAR',     Descripcion: 'Crear nuevos roles' },
  { Nombre: 'ROLES.EDITAR',        Descripcion: 'Editar roles existentes' },
  { Nombre: 'ROLES.CONSULTAR',     Descripcion: 'Ver detalle de un rol' },
  { Nombre: 'ROLES.LISTAR',        Descripcion: 'Listar todos los roles' },
  { Nombre: 'ROLES.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar roles' },
  // ACCESO
  { Nombre: 'ACCESO.LOGIN',              Descripcion: 'Iniciar sesión' },
  { Nombre: 'ACCESO.LOGOUT',             Descripcion: 'Cerrar sesión' },
  { Nombre: 'ACCESO.RECUPERAR_PASSWORD', Descripcion: 'Recuperar contraseña' },
  // DASHBOARD
  { Nombre: 'DASHBOARD.VER_STOCK',     Descripcion: 'Ver indicadores de stock en el dashboard' },
  { Nombre: 'DASHBOARD.VER_COMPRAS',   Descripcion: 'Ver indicadores de compras en el dashboard' },
  { Nombre: 'DASHBOARD.VER_SERVICIOS', Descripcion: 'Ver indicadores de servicios en el dashboard' },
  { Nombre: 'DASHBOARD.VER_EMPLEADOS', Descripcion: 'Ver indicadores de empleados en el dashboard' },
  // CATEGORIAS
  { Nombre: 'CATEGORIAS.REGISTRAR',     Descripcion: 'Crear categorías de repuestos' },
  { Nombre: 'CATEGORIAS.EDITAR',        Descripcion: 'Editar categorías de repuestos' },
  { Nombre: 'CATEGORIAS.CONSULTAR',     Descripcion: 'Ver detalle de una categoría' },
  { Nombre: 'CATEGORIAS.LISTAR',        Descripcion: 'Listar categorías de repuestos' },
  { Nombre: 'CATEGORIAS.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar categorías' },
  // PROVEEDORES
  { Nombre: 'PROVEEDORES.REGISTRAR',     Descripcion: 'Registrar proveedores' },
  { Nombre: 'PROVEEDORES.EDITAR',        Descripcion: 'Editar proveedores' },
  { Nombre: 'PROVEEDORES.CONSULTAR',     Descripcion: 'Ver detalle de un proveedor' },
  { Nombre: 'PROVEEDORES.LISTAR',        Descripcion: 'Listar proveedores' },
  { Nombre: 'PROVEEDORES.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar proveedores' },
  // COMPRAS
  { Nombre: 'COMPRAS.REGISTRAR', Descripcion: 'Registrar compras' },
  { Nombre: 'COMPRAS.CONSULTAR', Descripcion: 'Ver detalle de una compra' },
  { Nombre: 'COMPRAS.LISTAR',    Descripcion: 'Listar compras' },
  { Nombre: 'COMPRAS.ANULAR',    Descripcion: 'Anular compras' },
  // SERVICIOS
  { Nombre: 'SERVICIOS.REGISTRAR',     Descripcion: 'Registrar servicios' },
  { Nombre: 'SERVICIOS.EDITAR',        Descripcion: 'Editar servicios' },
  { Nombre: 'SERVICIOS.CONSULTAR',     Descripcion: 'Ver detalle de un servicio' },
  { Nombre: 'SERVICIOS.LISTAR',        Descripcion: 'Listar servicios' },
  { Nombre: 'SERVICIOS.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar servicios' },
  // AGENDA
  { Nombre: 'AGENDA.REGISTRAR',     Descripcion: 'Registrar citas en la agenda' },
  { Nombre: 'AGENDA.EDITAR',        Descripcion: 'Editar citas de la agenda' },
  { Nombre: 'AGENDA.CONSULTAR',     Descripcion: 'Ver detalle de una cita' },
  { Nombre: 'AGENDA.LISTAR',        Descripcion: 'Listar citas de la agenda' },
  { Nombre: 'AGENDA.CAMBIAR_ESTADO', Descripcion: 'Cambiar estado de citas' },
  // CLIENTES
  { Nombre: 'CLIENTES.REGISTRAR',     Descripcion: 'Registrar clientes' },
  { Nombre: 'CLIENTES.EDITAR',        Descripcion: 'Editar clientes' },
  { Nombre: 'CLIENTES.CONSULTAR',     Descripcion: 'Ver detalle de un cliente' },
  { Nombre: 'CLIENTES.LISTAR',        Descripcion: 'Listar clientes' },
  { Nombre: 'CLIENTES.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar clientes' },
  // VEHICULOS
  { Nombre: 'VEHICULOS.REGISTRAR',     Descripcion: 'Registrar vehículos' },
  { Nombre: 'VEHICULOS.EDITAR',        Descripcion: 'Editar vehículos' },
  { Nombre: 'VEHICULOS.CONSULTAR',     Descripcion: 'Ver detalle de un vehículo' },
  { Nombre: 'VEHICULOS.LISTAR',        Descripcion: 'Listar vehículos' },
  { Nombre: 'VEHICULOS.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar vehículos' },
  // NOVEDADES
  { Nombre: 'NOVEDADES.REGISTRAR',     Descripcion: 'Registrar novedades' },
  { Nombre: 'NOVEDADES.EDITAR',        Descripcion: 'Editar novedades' },
  { Nombre: 'NOVEDADES.CONSULTAR',     Descripcion: 'Ver detalle de una novedad' },
  { Nombre: 'NOVEDADES.LISTAR',        Descripcion: 'Listar novedades' },
  { Nombre: 'NOVEDADES.CAMBIAR_ESTADO', Descripcion: 'Cambiar estado de novedades' },
  // ORDENES
  { Nombre: 'ORDENES.EDITAR',        Descripcion: 'Editar órdenes de trabajo' },
  { Nombre: 'ORDENES.CONSULTAR',     Descripcion: 'Ver detalle de una orden de trabajo' },
  { Nombre: 'ORDENES.LISTAR',        Descripcion: 'Listar órdenes de trabajo' },
  { Nombre: 'ORDENES.CAMBIAR_ESTADO', Descripcion: 'Cambiar estado de órdenes de trabajo' },
  // EMPLEADOS
  { Nombre: 'EMPLEADOS.REGISTRAR',     Descripcion: 'Registrar empleados' },
  { Nombre: 'EMPLEADOS.EDITAR',        Descripcion: 'Editar empleados' },
  { Nombre: 'EMPLEADOS.CONSULTAR',     Descripcion: 'Ver detalle de un empleado' },
  { Nombre: 'EMPLEADOS.LISTAR',        Descripcion: 'Listar empleados' },
  { Nombre: 'EMPLEADOS.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar empleados' },
  // REPUESTOS
  { Nombre: 'REPUESTOS.REGISTRAR',     Descripcion: 'Registrar repuestos' },
  { Nombre: 'REPUESTOS.EDITAR',        Descripcion: 'Editar repuestos' },
  { Nombre: 'REPUESTOS.CONSULTAR',     Descripcion: 'Ver detalle de un repuesto' },
  { Nombre: 'REPUESTOS.LISTAR',        Descripcion: 'Listar repuestos y stock' },
  { Nombre: 'REPUESTOS.CAMBIAR_ESTADO', Descripcion: 'Activar/desactivar repuestos' },
];

async function main() {
  console.log('Insertando permisos...');
  const result = await prisma.permisos.createMany({
    data: permisos,
    skipDuplicates: true,
  });
  console.log(`${result.count} permisos insertados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
