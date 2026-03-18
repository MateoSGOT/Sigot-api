-- ============================================================
-- SIGOT - Script de datos iniciales (seed)
-- Ejecutar en orden: las tablas con FK van después de sus padres
-- ============================================================

USE sigot_db;
GO

-- ============================================================
-- 1. TIPOS DE DOCUMENTO
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = 'Cédula de Ciudadanía')
    INSERT INTO Tipo_Doc (Nombre) VALUES ('Cédula de Ciudadanía');

IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = 'Cédula de Extranjería')
    INSERT INTO Tipo_Doc (Nombre) VALUES ('Cédula de Extranjería');

IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = 'NIT')
    INSERT INTO Tipo_Doc (Nombre) VALUES ('NIT');

IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = 'Pasaporte')
    INSERT INTO Tipo_Doc (Nombre) VALUES ('Pasaporte');

IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = 'Tarjeta de Identidad')
    INSERT INTO Tipo_Doc (Nombre) VALUES ('Tarjeta de Identidad');

-- ============================================================
-- 2. ROLES
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Rol WHERE Nombre = 'Administrador')
    INSERT INTO Rol (Nombre, Descripcion, Estado) VALUES ('Administrador', 'Acceso total al sistema', 1);

IF NOT EXISTS (SELECT 1 FROM Rol WHERE Nombre = 'Mecánico')
    INSERT INTO Rol (Nombre, Descripcion, Estado) VALUES ('Mecánico', 'Técnico de taller', 1);

IF NOT EXISTS (SELECT 1 FROM Rol WHERE Nombre = 'Recepcionista')
    INSERT INTO Rol (Nombre, Descripcion, Estado) VALUES ('Recepcionista', 'Atención al cliente y agenda', 1);

-- ============================================================
-- 3. MARCAS DE VEHÍCULO
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Chevrolet')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Chevrolet', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Renault')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Renault', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Mazda')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Mazda', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Toyota')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Toyota', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Nissan')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Nissan', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Kia')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Kia', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Hyundai')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Hyundai', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Ford')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Ford', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Volkswagen')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Volkswagen', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Honda')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Honda', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Suzuki')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Suzuki', 1);

IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = 'Mitsubishi')
    INSERT INTO Marca (Nombre, Estado) VALUES ('Mitsubishi', 1);

-- ============================================================
-- 4. CATEGORÍAS DE REPUESTOS
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Filtros')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Filtros', 'Filtros de aceite, aire y combustible', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Frenos')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Frenos', 'Pastillas, discos y tambores', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Suspensión')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Suspensión', 'Amortiguadores, resortes y bujes', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Motor')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Motor', 'Partes internas del motor', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Eléctrico')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Eléctrico', 'Baterías, alternadores y fusibles', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Transmisión')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Transmisión', 'Embrague, caja de cambios y diferenciales', 1);

IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = 'Lubricantes')
    INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('Lubricantes', 'Aceites y grasas', 1);

-- ============================================================
-- 5. SERVICIOS DEL TALLER
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Cambio de aceite')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Cambio de aceite', 'Cambio de aceite de motor y filtro', 80000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Revisión de frenos')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Revisión de frenos', 'Inspección y ajuste del sistema de frenos', 60000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Cambio de pastillas')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Cambio de pastillas', 'Cambio de pastillas de freno delanteras', 120000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Alineación y balanceo')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Alineación y balanceo', 'Alineación de dirección y balanceo de ruedas', 90000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Diagnóstico general')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Diagnóstico general', 'Revisión completa del vehículo con scanner', 50000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Cambio de correa de distribución')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Cambio de correa de distribución', 'Reemplazo de correa de distribución y tensor', 350000, 1);

IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = 'Mantenimiento preventivo')
    INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('Mantenimiento preventivo', 'Revisión de 30 puntos del vehículo', 180000, 1);

-- ============================================================
-- 6. EMPLEADO ADMINISTRADOR INICIAL
--    Password: Admin2024!  (hash bcrypt de 10 rondas)
--    IMPORTANTE: cambia la contraseña después del primer login
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Empleado WHERE Correo = 'admin@sigot.com')
BEGIN
    DECLARE @id_rol_admin INT = (SELECT TOP 1 Id_Rol FROM Rol WHERE Nombre = 'Administrador');
    DECLARE @id_tipo_cc   INT = (SELECT TOP 1 Id_TipoDoc FROM Tipo_Doc WHERE Nombre = 'Cédula de Ciudadanía');

    INSERT INTO Empleado (Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Password, Estado)
    VALUES (
        '0000000001',
        'Administrador SIGOT',
        @id_tipo_cc,
        @id_rol_admin,
        'admin@sigot.com',
        -- Hash bcrypt de: Admin2024!
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lihO',
        1
    );
END

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'Tipo_Doc'          AS Tabla, COUNT(*) AS Registros FROM Tipo_Doc
UNION ALL
SELECT 'Rol',                         COUNT(*) FROM Rol
UNION ALL
SELECT 'Marca',                        COUNT(*) FROM Marca
UNION ALL
SELECT 'CategoriaRepuestos',           COUNT(*) FROM CategoriaRepuestos
UNION ALL
SELECT 'Servicios',                    COUNT(*) FROM Servicios
UNION ALL
SELECT 'Empleado (admin)',             COUNT(*) FROM Empleado WHERE Correo = 'admin@sigot.com';
GO
