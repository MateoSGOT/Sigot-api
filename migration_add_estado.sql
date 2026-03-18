-- ============================================================
-- SIGOT - Migración: agregar columna Estado a Vehiculo y Agenda
-- ============================================================

USE sigot_db;
GO

-- Vehiculo
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Vehiculo') AND name = 'Estado'
)
BEGIN
  ALTER TABLE Vehiculo ADD Estado bit NOT NULL DEFAULT 1;
  PRINT 'OK: Estado agregado a Vehiculo';
END
ELSE
  PRINT 'SKIP: Vehiculo ya tiene columna Estado';
GO

-- Agenda
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Agenda') AND name = 'Estado'
)
BEGIN
  ALTER TABLE Agenda ADD Estado bit NOT NULL DEFAULT 1;
  PRINT 'OK: Estado agregado a Agenda';
END
ELSE
  PRINT 'SKIP: Agenda ya tiene columna Estado';
GO

-- Verificación
SELECT
  t.name AS Tabla,
  c.name AS Columna,
  c.is_nullable,
  OBJECT_DEFINITION(c.default_object_id) AS DefaultValue
FROM sys.columns c
JOIN sys.tables t ON t.object_id = c.object_id
WHERE t.name IN ('Vehiculo', 'Agenda') AND c.name = 'Estado';
GO
