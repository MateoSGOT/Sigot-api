require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PERMISOS_MECANICO = [
  'SERVICIOS.LISTAR',   'SERVICIOS.CONSULTAR',
  'REPUESTOS.LISTAR',   'REPUESTOS.CONSULTAR',
  'CLIENTES.LISTAR',    'CLIENTES.CONSULTAR',
  'VEHICULOS.LISTAR',   'VEHICULOS.CONSULTAR',
  'AGENDA.LISTAR',      'AGENDA.CONSULTAR',    'AGENDA.REGISTRAR', 'AGENDA.EDITAR', 'AGENDA.CAMBIAR_ESTADO',
  'ORDENES.LISTAR',     'ORDENES.CONSULTAR',   'ORDENES.EDITAR',   'ORDENES.CAMBIAR_ESTADO',
  'NOVEDADES.LISTAR',   'NOVEDADES.REGISTRAR', 'NOVEDADES.EDITAR',
  'CATEGORIAS.LISTAR',
  'PROVEEDORES.LISTAR',
];

async function main() {
  const rol = await prisma.rol.findFirst({ where: { Nombre: 'Mecánico' } });
  if (!rol) throw new Error('Rol "Mecánico" no encontrado en la BD. Verifica que el seed se ejecutó.');
  console.log(`Rol Mecánico encontrado → Id_Rol = ${rol.Id_Rol}`);

  let asignados = 0;
  const noEncontrados = [];

  for (const nombre of PERMISOS_MECANICO) {
    const permiso = await prisma.permisos.findFirst({ where: { Nombre: nombre } });
    if (!permiso) { noEncontrados.push(nombre); continue; }

    await prisma.roles_x_Permisos.upsert({
      where:  { Id_Rol_Id_Permiso: { Id_Rol: rol.Id_Rol, Id_Permiso: permiso.Id_Permiso } },
      update: {},
      create: { Id_Rol: rol.Id_Rol, Id_Permiso: permiso.Id_Permiso },
    });
    asignados++;
    console.log(`  ✓ ${nombre}`);
  }

  console.log(`\n✅  ${asignados} permiso(s) asignado(s) al rol Mecánico.`);
  if (noEncontrados.length > 0) {
    console.warn(`⚠️   Permisos no encontrados en la BD: ${noEncontrados.join(', ')}`);
  }
}

main()
  .catch((e) => { console.error('ERROR:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
