-- CreateTable
CREATE TABLE "Tipo_Doc" (
    "Id_TipoDoc" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tipo_Doc_pkey" PRIMARY KEY ("Id_TipoDoc")
);

-- CreateTable
CREATE TABLE "Rol" (
    "Id_Rol" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Descripcion" VARCHAR(200),
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("Id_Rol")
);

-- CreateTable
CREATE TABLE "Permisos" (
    "Id_Permiso" SERIAL NOT NULL,
    "Nombre" VARCHAR(80) NOT NULL,
    "Descripcion" VARCHAR(200),

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("Id_Permiso")
);

-- CreateTable
CREATE TABLE "Roles_x_Permisos" (
    "Id_Rol" INTEGER NOT NULL,
    "Id_Permiso" INTEGER NOT NULL,

    CONSTRAINT "Roles_x_Permisos_pkey" PRIMARY KEY ("Id_Rol","Id_Permiso")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id_empleado" SERIAL NOT NULL,
    "Documento" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Id_TipoDoc" INTEGER NOT NULL,
    "Id_Rol" INTEGER NOT NULL,
    "Correo" VARCHAR(120) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "Foto" VARCHAR(255),
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "Id_Cliente" SERIAL NOT NULL,
    "Documento" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Id_TipoDoc" INTEGER NOT NULL,
    "Foto" VARCHAR(255),
    "Estado" BOOLEAN NOT NULL DEFAULT true,
    "Correo" VARCHAR(120),
    "Contacto" VARCHAR(50),

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("Id_Cliente")
);

-- CreateTable
CREATE TABLE "Marca" (
    "Id_Marca" SERIAL NOT NULL,
    "Nombre" VARCHAR(60) NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("Id_Marca")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "Id_Vehiculo" SERIAL NOT NULL,
    "Placa" VARCHAR(10) NOT NULL,
    "VIN" VARCHAR(30),
    "Id_Cliente" INTEGER NOT NULL,
    "Id_Marca" INTEGER NOT NULL,
    "Modelo" VARCHAR(50) NOT NULL,
    "Año" INTEGER NOT NULL,
    "Color" VARCHAR(30),
    "NumeroEjes" INTEGER,
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("Id_Vehiculo")
);

-- CreateTable
CREATE TABLE "CategoriaRepuestos" (
    "Id_categoria" SERIAL NOT NULL,
    "Nombre" VARCHAR(60) NOT NULL,
    "Descripcion" VARCHAR(200),
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CategoriaRepuestos_pkey" PRIMARY KEY ("Id_categoria")
);

-- CreateTable
CREATE TABLE "Repuestos" (
    "Id_Repuesto" SERIAL NOT NULL,
    "NombreRepuesto" VARCHAR(120) NOT NULL,
    "Stock" INTEGER NOT NULL DEFAULT 0,
    "Precio" DECIMAL(10,2) NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,
    "Id_categoria" INTEGER NOT NULL,

    CONSTRAINT "Repuestos_pkey" PRIMARY KEY ("Id_Repuesto")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "Documento" VARCHAR(20) NOT NULL,
    "TipoProveedor" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "correo" VARCHAR(120),
    "contacto" VARCHAR(20),
    "ciudad" VARCHAR(60),
    "direccion" VARCHAR(150),
    "detalles" VARCHAR(200),
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Compras" (
    "Id_Compra" SERIAL NOT NULL,
    "Fecha_compra" DATE NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "Total" DECIMAL(10,2) NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("Id_Compra")
);

-- CreateTable
CREATE TABLE "Compras_Detalle" (
    "Id_Compra" INTEGER NOT NULL,
    "Id_Repuesto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "valor_unidad" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Compras_Detalle_pkey" PRIMARY KEY ("Id_Compra","Id_Repuesto")
);

-- CreateTable
CREATE TABLE "Servicios" (
    "Id_Servicio" SERIAL NOT NULL,
    "Nombre" VARCHAR(80) NOT NULL,
    "Descripcion" VARCHAR(200),
    "Precio" DECIMAL(10,2) NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("Id_Servicio")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "Id_Agenda" SERIAL NOT NULL,
    "Id_Cliente" INTEGER NOT NULL,
    "Id_Vehiculo" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "FechaAgendamiento" DATE NOT NULL,
    "Hora" VARCHAR(8) NOT NULL,
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("Id_Agenda")
);

-- CreateTable
CREATE TABLE "Orden_de_Trabajo" (
    "Id_Orden" SERIAL NOT NULL,
    "Id_Agenda" INTEGER NOT NULL,
    "Diagnostico" VARCHAR(500),
    "Kilometraje" INTEGER,
    "FechaIngreso" DATE,
    "FechaEntrega" DATE,
    "Estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Orden_de_Trabajo_pkey" PRIMARY KEY ("Id_Orden")
);

-- CreateTable
CREATE TABLE "Orden_de_Trabajo_x_Servicios" (
    "Id_Orden" INTEGER NOT NULL,
    "Id_Servicio" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Orden_de_Trabajo_x_Servicios_pkey" PRIMARY KEY ("Id_Orden","Id_Servicio")
);

-- CreateTable
CREATE TABLE "Orden_de_Trabajo_x_Repuestos" (
    "Id_Orden" INTEGER NOT NULL,
    "Id_Repuesto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Orden_de_Trabajo_x_Repuestos_pkey" PRIMARY KEY ("Id_Orden","Id_Repuesto")
);

-- CreateTable
CREATE TABLE "Novedades" (
    "Id_Novedad" SERIAL NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "Descripcion" VARCHAR(500),
    "Fecha_Novedad" DATE,
    "FechaRealizacion" DATE,

    CONSTRAINT "Novedades_pkey" PRIMARY KEY ("Id_Novedad")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_Correo_key" ON "Empleado"("Correo");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_Placa_key" ON "Vehiculo"("Placa");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_VIN_key" ON "Vehiculo"("VIN");

-- AddForeignKey
ALTER TABLE "Roles_x_Permisos" ADD CONSTRAINT "Roles_x_Permisos_Id_Rol_fkey" FOREIGN KEY ("Id_Rol") REFERENCES "Rol"("Id_Rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_x_Permisos" ADD CONSTRAINT "Roles_x_Permisos_Id_Permiso_fkey" FOREIGN KEY ("Id_Permiso") REFERENCES "Permisos"("Id_Permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "Tipo_Doc"("Id_TipoDoc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_Id_Rol_fkey" FOREIGN KEY ("Id_Rol") REFERENCES "Rol"("Id_Rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "Tipo_Doc"("Id_TipoDoc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_Id_Cliente_fkey" FOREIGN KEY ("Id_Cliente") REFERENCES "Cliente"("Id_Cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_Id_Marca_fkey" FOREIGN KEY ("Id_Marca") REFERENCES "Marca"("Id_Marca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repuestos" ADD CONSTRAINT "Repuestos_Id_categoria_fkey" FOREIGN KEY ("Id_categoria") REFERENCES "CategoriaRepuestos"("Id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "Compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compras_Detalle" ADD CONSTRAINT "Compras_Detalle_Id_Compra_fkey" FOREIGN KEY ("Id_Compra") REFERENCES "Compras"("Id_Compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compras_Detalle" ADD CONSTRAINT "Compras_Detalle_Id_Repuesto_fkey" FOREIGN KEY ("Id_Repuesto") REFERENCES "Repuestos"("Id_Repuesto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_Id_Cliente_fkey" FOREIGN KEY ("Id_Cliente") REFERENCES "Cliente"("Id_Cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_Id_Vehiculo_fkey" FOREIGN KEY ("Id_Vehiculo") REFERENCES "Vehiculo"("Id_Vehiculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_de_Trabajo" ADD CONSTRAINT "Orden_de_Trabajo_Id_Agenda_fkey" FOREIGN KEY ("Id_Agenda") REFERENCES "Agenda"("Id_Agenda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_de_Trabajo_x_Servicios" ADD CONSTRAINT "Orden_de_Trabajo_x_Servicios_Id_Orden_fkey" FOREIGN KEY ("Id_Orden") REFERENCES "Orden_de_Trabajo"("Id_Orden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_de_Trabajo_x_Servicios" ADD CONSTRAINT "Orden_de_Trabajo_x_Servicios_Id_Servicio_fkey" FOREIGN KEY ("Id_Servicio") REFERENCES "Servicios"("Id_Servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_de_Trabajo_x_Repuestos" ADD CONSTRAINT "Orden_de_Trabajo_x_Repuestos_Id_Orden_fkey" FOREIGN KEY ("Id_Orden") REFERENCES "Orden_de_Trabajo"("Id_Orden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_de_Trabajo_x_Repuestos" ADD CONSTRAINT "Orden_de_Trabajo_x_Repuestos_Id_Repuesto_fkey" FOREIGN KEY ("Id_Repuesto") REFERENCES "Repuestos"("Id_Repuesto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novedades" ADD CONSTRAINT "Novedades_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;
