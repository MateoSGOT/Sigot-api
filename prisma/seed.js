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
  // ── Permisos ──────────────────────────────────────────────────────────────
  console.log('Insertando permisos...');
  const pResult = await prisma.permisos.createMany({ data: permisos, skipDuplicates: true });
  console.log(`${pResult.count} permisos insertados.`);

  // ── Tipos de documento ────────────────────────────────────────────────────
  const tiposDoc = ['Cédula de Ciudadanía','Cédula de Extranjería','NIT','Pasaporte','Tarjeta de Identidad'];
  for (const nombre of tiposDoc) {
    await prisma.tipo_Doc.upsert({
      where:  { Id_TipoDoc: tiposDoc.indexOf(nombre) + 1 },
      update: {},
      create: { Nombre: nombre },
    });
  }
  console.log('Tipos de documento listos.');

  // ── Roles ─────────────────────────────────────────────────────────────────
  const rolesData = [
    { Nombre: 'Administrador', Descripcion: 'Acceso total al sistema' },
    { Nombre: 'Mecánico',      Descripcion: 'Técnico de taller' },
    { Nombre: 'Recepcionista', Descripcion: 'Atención al cliente y agenda' },
  ];
  for (const r of rolesData) {
    await prisma.rol.upsert({
      where:  { Id_Rol: rolesData.indexOf(r) + 1 },
      update: {},
      create: r,
    });
  }
  console.log('Roles listos.');

  // ── Asignar todos los permisos al rol Administrador ──────────────────────
  const todosPermisos = await prisma.permisos.findMany({ select: { Id_Permiso: true } });
  const rol = await prisma.rol.findFirst({ where: { Nombre: 'Administrador' } });
  if (rol) {
    for (const p of todosPermisos) {
      await prisma.roles_x_Permisos.upsert({
        where:  { Id_Rol_Id_Permiso: { Id_Rol: rol.Id_Rol, Id_Permiso: p.Id_Permiso } },
        update: {},
        create: { Id_Rol: rol.Id_Rol, Id_Permiso: p.Id_Permiso },
      });
    }
    console.log(`Permisos asignados al rol Administrador.`);
  }

  // ── Marcas ────────────────────────────────────────────────────────────────
  const marcas = ['Chevrolet','Renault','Mazda','Toyota','Nissan','Kia','Hyundai','Ford','Volkswagen','Honda','Suzuki','Mitsubishi'];
  for (const nombre of marcas) {
    const existe = await prisma.marca.findFirst({ where: { Nombre: nombre } });
    if (!existe) await prisma.marca.create({ data: { Nombre: nombre } });
  }
  console.log('Marcas listas.');

  // ── Categorías de repuestos ───────────────────────────────────────────────
  const categorias = [
    { Nombre: 'Filtros',     Descripcion: 'Filtros de aceite, aire y combustible' },
    { Nombre: 'Frenos',      Descripcion: 'Pastillas, discos y tambores' },
    { Nombre: 'Suspensión',  Descripcion: 'Amortiguadores, resortes y bujes' },
    { Nombre: 'Motor',       Descripcion: 'Partes internas del motor' },
    { Nombre: 'Eléctrico',   Descripcion: 'Baterías, alternadores y fusibles' },
    { Nombre: 'Transmisión', Descripcion: 'Embrague, caja de cambios y diferenciales' },
    { Nombre: 'Lubricantes', Descripcion: 'Aceites y grasas' },
  ];
  for (const c of categorias) {
    const existe = await prisma.categoriaRepuestos.findFirst({ where: { Nombre: c.Nombre } });
    if (!existe) await prisma.categoriaRepuestos.create({ data: c });
  }
  console.log('Categorías de repuestos listas.');

  // ── Servicios ─────────────────────────────────────────────────────────────
  const servicios = [
    { Nombre: 'Cambio de aceite',               Precio: 80000 },
    { Nombre: 'Revisión de frenos',             Precio: 60000 },
    { Nombre: 'Cambio de pastillas',            Precio: 120000 },
    { Nombre: 'Alineación y balanceo',          Precio: 90000 },
    { Nombre: 'Diagnóstico general',            Precio: 50000 },
    { Nombre: 'Cambio de correa distribución',  Precio: 350000 },
    { Nombre: 'Mantenimiento preventivo',       Precio: 180000 },
    { Nombre: 'Revisión general',               Precio: 70000 },
    { Nombre: 'Alineación',                     Precio: 45000 },
    { Nombre: 'Balanceo',                       Precio: 45000 },
    { Nombre: 'Cambio de frenos',               Precio: 120000 },
    { Nombre: 'Diagnóstico eléctrico',          Precio: 60000 },
  ];
  for (const s of servicios) {
    const existe = await prisma.servicios.findFirst({ where: { Nombre: s.Nombre } });
    if (!existe) await prisma.servicios.create({ data: { ...s, Descripcion: null } });
  }
  console.log('Servicios listos.');

  // ── Empleado administrador ────────────────────────────────────────────────
  const bcrypt = require('bcryptjs');
  const tipoCC = await prisma.tipo_Doc.findFirst({ where: { Nombre: 'Cédula de Ciudadanía' } });
  const rolAdmin = await prisma.rol.findFirst({ where: { Nombre: 'Administrador' } });

  const adminExiste = await prisma.empleado.findFirst({ where: { Correo: 'admin@sigot.com' } });
  if (!adminExiste && tipoCC && rolAdmin) {
    const hash = await bcrypt.hash('Admin2024!', 10);
    await prisma.empleado.create({
      data: {
        Documento:  '0000000001',
        Nombre:     'Administrador SIGOT',
        Id_TipoDoc: tipoCC.Id_TipoDoc,
        Id_Rol:     rolAdmin.Id_Rol,
        Correo:     'admin@sigot.com',
        Password:   hash,
        Estado:     true,
      },
    });
    console.log('Empleado admin@sigot.com creado.');
  } else {
    console.log('Empleado admin ya existe.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
