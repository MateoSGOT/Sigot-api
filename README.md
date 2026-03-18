# SIGOT API

API REST para el sistema de gestión de taller mecánico **SIGOT** (Sistema de Gestión de Órdenes de Taller). Permite administrar clientes, vehículos, empleados, repuestos, compras, servicios, agenda de citas y órdenes de trabajo.

---

## Tabla de contenidos

1. [Tecnologías usadas](#tecnologías-usadas)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y configuración](#instalación-y-configuración)
4. [Variables de entorno](#variables-de-entorno)
5. [Autenticación JWT](#autenticación-jwt)
6. [Formato de respuestas](#formato-de-respuestas)
7. [Códigos de error comunes](#códigos-de-error-comunes)
8. [Endpoints por módulo](#endpoints-por-módulo)
   - [Health](#health)
   - [Auth](#auth)
   - [Catálogos](#catálogos)
   - [Roles](#roles)
   - [Clientes](#clientes)
   - [Vehículos](#vehículos)
   - [Empleados](#empleados)
   - [Categorías de Repuesto](#categorías-de-repuesto)
   - [Repuestos](#repuestos)
   - [Proveedores](#proveedores)
   - [Compras](#compras)
   - [Servicios](#servicios)
   - [Agenda](#agenda)
   - [Órdenes de Trabajo](#órdenes-de-trabajo)
   - [Novedades](#novedades)
   - [Dashboard](#dashboard)

---

## Tecnologías usadas

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Entorno de ejecución |
| Express | ^5.2 | Framework HTTP |
| SQL Server | — | Base de datos |
| mssql | ^12.2 | Driver de SQL Server |
| jsonwebtoken | ^9.0 | Autenticación JWT |
| bcryptjs | ^3.0 | Hash de contraseñas |
| joi | ^18.0 | Validación de datos |
| dotenv | ^17 | Variables de entorno |
| cors | ^2.8 | Control de acceso CORS |
| morgan | ^1.10 | Logger de peticiones HTTP |
| nodemon | ^3.1 | Recarga automática en desarrollo |

---

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **SQL Server** 2016 o superior (local o remoto)
- La base de datos `sigot_db` creada con el esquema correspondiente

---

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd sigot-api

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Iniciar en producción
npm start
```

---

## Variables de entorno

Crear el archivo `.env` en la raíz del proyecto con los siguientes campos:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos SQL Server
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=sigot_db
DB_USER=sa
DB_PASSWORD=tu_password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# JWT
JWT_SECRET=tu_clave_secreta_muy_larga
JWT_EXPIRES_IN=8h
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto donde escucha la API | `3000` |
| `NODE_ENV` | Entorno (`development` / `production`) | `development` |
| `DB_SERVER` | Host del servidor SQL Server | `localhost` |
| `DB_PORT` | Puerto SQL Server | `1433` |
| `DB_DATABASE` | Nombre de la base de datos | `sigot_db` |
| `DB_USER` | Usuario de la base de datos | `sa` |
| `DB_PASSWORD` | Contraseña de la base de datos | `Admin123!` |
| `DB_ENCRYPT` | Cifrar conexión (`true` / `false`) | `false` |
| `DB_TRUST_SERVER_CERTIFICATE` | Confiar en certificado auto-firmado | `true` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `clave_muy_segura` |
| `JWT_EXPIRES_IN` | Duración del token | `8h` |

> **Nota:** En producción usa `NODE_ENV=production`. Los detalles técnicos de errores SQL dejan de exponerse en las respuestas.

---

## Autenticación JWT

La API usa **Bearer Token** para proteger los endpoints. El flujo es:

### 1. Hacer login

```http
POST /api/auth/login
Content-Type: application/json

{
  "Correo": "admin@sigot.com",
  "Password": "12345678"
}
```

### 2. Recibir el token

```json
{
  "status": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "empleado": {
      "Id_Empleado": 1,
      "Nombre": "Admin SIGOT",
      "Correo": "admin@sigot.com"
    }
  }
}
```

### 3. Usar el token en cada petición

Incluir el header `Authorization` en todas las peticiones a endpoints protegidos:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Los endpoints **sin autenticación** son: `POST /api/auth/login`, `POST /api/auth/registro`, `POST /api/auth/recuperar-password`, `GET /api/catalogos/tipos-documento`, `GET /api/catalogos/marcas` y `GET /health`.

---

## Formato de respuestas

Todas las respuestas siguen el mismo formato JSON:

**Éxito:**
```json
{
  "status": "ok",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

## Códigos de error comunes

| Código HTTP | Significado | Cuándo ocurre |
|---|---|---|
| `400` | Bad Request | Datos de entrada inválidos, campo faltante o FK inválida |
| `401` | Unauthorized | Token ausente, inválido o expirado |
| `404` | Not Found | El recurso solicitado no existe |
| `409` | Conflict | Registro duplicado (documento, correo, placa, VIN) |
| `500` | Internal Server Error | Error inesperado del servidor |

**Errores SQL Server mapeados a 400:**

| Código SQL | Mensaje devuelto |
|---|---|
| `2627` / `2601` | Ya existe un registro con ese valor único (duplicado) |
| `547` | El valor enviado no existe en una tabla relacionada (FK inválida) |
| `515` | Un campo obligatorio recibió un valor nulo |
| `8152` | El valor excede la longitud máxima permitida para ese campo |

---

## Endpoints por módulo

### Health

Verificar que la API está activa. No requiere autenticación.

---

#### `GET /health`

**Descripción:** Estado del servidor.

**Headers:** Ninguno.

**Respuesta exitosa `200`:**
```json
{ "status": "ok", "message": "API SIGOT funcionando" }
```

---

### Auth

Gestión de sesión y registro de empleados.

---

#### `POST /api/auth/login`

**Descripción:** Inicia sesión y retorna un token JWT.
**Autenticación:** No requerida.

**Body:**
```json
{
  "Correo": "admin@sigot.com",
  "Password": "12345678"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Correo` | string (email) | Sí | Correo del empleado |
| `Password` | string | Sí | Contraseña |

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": {
    "token": "eyJhbGci...",
    "empleado": {
      "Id_Empleado": 1,
      "Nombre": "Admin SIGOT",
      "Correo": "admin@sigot.com"
    }
  }
}
```

**Respuesta de error `401`:**
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

---

#### `POST /api/auth/registro`

**Descripción:** Registra un nuevo empleado en el sistema.
**Autenticación:** No requerida.

**Body:**
```json
{
  "Documento": "1234567890",
  "Nombre": "Carlos Méndez",
  "Id_TipoDoc": 1,
  "Id_Rol": 2,
  "Correo": "carlos@sigot.com",
  "Password": "12345678",
  "Foto": null
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Documento` | string (máx 20) | Sí | Número de documento |
| `Nombre` | string (máx 100) | Sí | Nombre completo |
| `Id_TipoDoc` | integer | Sí | ID del tipo de documento (ver Catálogos) |
| `Id_Rol` | integer | Sí | ID del rol asignado |
| `Correo` | string (email, máx 120) | Sí | Correo electrónico |
| `Password` | string (mín 8 caracteres) | Sí | Contraseña |
| `Foto` | string | No | URL de foto de perfil |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": {
    "Id_Empleado": 5,
    "Nombre": "Carlos Méndez",
    "Correo": "carlos@sigot.com"
  }
}
```

**Respuesta de error `409`:**
```json
{
  "status": "error",
  "message": "Ya existe un registro con ese valor único (duplicado)"
}
```

---

#### `POST /api/auth/logout`

**Descripción:** Cierra la sesión del usuario autenticado.
**Autenticación:** Requerida.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** Ninguno.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "message": "Sesión cerrada correctamente"
}
```

---

#### `POST /api/auth/recuperar-password`

**Descripción:** Solicita recuperación de contraseña por correo.
**Autenticación:** No requerida.

**Body:**
```json
{
  "Correo": "admin@sigot.com"
}
```

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "message": "Si el correo existe, se enviaron las instrucciones"
}
```

---

### Catálogos

Datos de referencia para poblar formularios. No requieren autenticación.

---

#### `GET /api/catalogos/tipos-documento`

**Descripción:** Lista todos los tipos de documento disponibles.
**Autenticación:** No requerida.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    { "Id_TipoDoc": 1, "Nombre": "Cédula de Ciudadanía" },
    { "Id_TipoDoc": 2, "Nombre": "NIT" },
    { "Id_TipoDoc": 3, "Nombre": "Pasaporte" }
  ]
}
```

---

#### `GET /api/catalogos/marcas`

**Descripción:** Lista todas las marcas de vehículo disponibles.
**Autenticación:** No requerida.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    { "Id_Marca": 1, "Nombre": "Chevrolet" },
    { "Id_Marca": 2, "Nombre": "Honda" },
    { "Id_Marca": 3, "Nombre": "Toyota" }
  ]
}
```

---

### Roles

Gestión de roles del sistema.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/roles`

**Descripción:** Lista todos los roles.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    { "Id_Rol": 1, "Nombre": "Administrador", "Descripcion": "Acceso total", "Estado": true },
    { "Id_Rol": 2, "Nombre": "Mecánico", "Descripcion": "Técnico de taller", "Estado": true }
  ]
}
```

---

#### `GET /api/roles/:id`

**Descripción:** Obtiene un rol por su ID.

**Parámetro de ruta:** `id` — ID del rol.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": { "Id_Rol": 1, "Nombre": "Administrador", "Descripcion": "Acceso total", "Estado": true }
}
```

**Respuesta de error `404`:**
```json
{ "status": "error", "message": "Rol con ID 99 no encontrado" }
```

---

#### `POST /api/roles`

**Descripción:** Crea un nuevo rol.

**Body:**
```json
{
  "Nombre": "Mecánico",
  "Descripcion": "Técnico de taller"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `Nombre` | string | Sí |
| `Descripcion` | string | No |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Rol": 3, "Nombre": "Mecánico", "Descripcion": "Técnico de taller", "Estado": true }
}
```

---

#### `PUT /api/roles/:id`

**Descripción:** Actualiza un rol existente.

**Body:**
```json
{
  "Nombre": "Mecánico Senior",
  "Descripcion": "Técnico senior de taller"
}
```

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": { "Id_Rol": 3, "Nombre": "Mecánico Senior", "Descripcion": "Técnico senior de taller" }
}
```

---

#### `PATCH /api/roles/:id/estado`

**Descripción:** Activa o desactiva un rol (borrado lógico).

**Body:**
```json
{ "Estado": 0 }
```

| Campo | Tipo | Valores |
|---|---|---|
| `Estado` | integer | `1` = activo, `0` = inactivo |

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": { "Id_Rol": 3, "Estado": false }
}
```

---

### Clientes

Gestión de clientes del taller.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/clientes`

**Descripción:** Lista todos los clientes activos.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Cliente": 1,
      "Documento": "987654321",
      "Nombre": "Juan Pérez",
      "TipoDoc": "Cédula de Ciudadanía",
      "Correo": "juan@correo.com",
      "Contacto": "3001234567",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/clientes/:id`

**Descripción:** Obtiene un cliente por su ID.

---

#### `POST /api/clientes`

**Descripción:** Registra un nuevo cliente.

**Body:**
```json
{
  "Documento": "987654321",
  "Nombre": "Juan Pérez",
  "Id_TipoDoc": 1,
  "Correo": "juan@correo.com",
  "Contacto": "3001234567",
  "Foto": null
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Documento` | string (máx 20) | Sí | Número de documento |
| `Nombre` | string (máx 100) | Sí | Nombre completo |
| `Id_TipoDoc` | integer | Sí | Tipo de documento |
| `Correo` | string (email) | No | Correo electrónico |
| `Contacto` | string (máx 50) | No | Teléfono de contacto |
| `Foto` | string | No | URL de foto |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Cliente": 5, "Documento": "987654321", "Nombre": "Juan Pérez" }
}
```

---

#### `PUT /api/clientes/:id`

**Descripción:** Actualiza los datos de un cliente. Se puede enviar uno o más campos.

**Body:**
```json
{
  "Nombre": "Juan Pérez García",
  "Contacto": "3009876543"
}
```

---

#### `PATCH /api/clientes/:id/estado`

**Descripción:** Activa o desactiva un cliente.

**Body:**
```json
{ "Estado": 0 }
```

---

### Vehículos

Gestión de vehículos asociados a clientes.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/vehiculos`

**Descripción:** Lista todos los vehículos activos.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Vehiculo": 1,
      "Placa": "ABC123",
      "VIN": "1HGCM82633A123456",
      "Modelo": "Civic",
      "Año": 2020,
      "Color": "Rojo",
      "NumeroEjes": 2,
      "Marca": "Honda",
      "Cliente": "Juan Pérez",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/vehiculos/:id`

**Descripción:** Obtiene un vehículo por su ID.

---

#### `POST /api/vehiculos`

**Descripción:** Registra un nuevo vehículo. Valida que el cliente y la marca existan, y que la placa/VIN no estén duplicados.

**Body:**
```json
{
  "Placa": "ABC123",
  "VIN": "1HGCM82633A123456",
  "Id_Cliente": 1,
  "Id_Marca": 2,
  "Modelo": "Civic",
  "Año": 2020,
  "Color": "Rojo",
  "NumeroEjes": 2
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Placa` | string (máx 10) | Sí | Placa del vehículo (única) |
| `VIN` | string (máx 30) | No | Número de identificación vehicular (único) |
| `Id_Cliente` | integer | Sí | ID del cliente propietario |
| `Id_Marca` | integer | Sí | ID de la marca (ver Catálogos) |
| `Modelo` | string (máx 50) | Sí | Modelo del vehículo |
| `Año` | integer (1900–año actual+1) | Sí | Año de fabricación |
| `Color` | string (máx 30) | No | Color del vehículo |
| `NumeroEjes` | integer (≥ 1) | No | Número de ejes |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Vehiculo": 3, "Placa": "ABC123", "Modelo": "Civic" }
}
```

**Respuesta de error `409`:**
```json
{ "status": "error", "message": "Ya existe un vehículo con la placa ABC123" }
```

---

#### `PUT /api/vehiculos/:id`

**Descripción:** Actualiza los datos de un vehículo.

**Body (ejemplo):**
```json
{
  "Color": "Azul",
  "Modelo": "Civic EX"
}
```

---

#### `PATCH /api/vehiculos/:id/estado`

**Descripción:** Activa o desactiva un vehículo.

**Body:**
```json
{ "Estado": 0 }
```

---

### Empleados

Gestión de empleados del taller.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/empleados`

**Descripción:** Lista todos los empleados.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Empleado": 1,
      "Documento": "1234567890",
      "Nombre": "Admin SIGOT",
      "Correo": "admin@sigot.com",
      "Rol": "Administrador",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/empleados/:id`

**Descripción:** Obtiene un empleado por su ID.

---

#### `POST /api/empleados`

**Descripción:** Crea un nuevo empleado.

**Body:**
```json
{
  "Documento": "112233445",
  "Nombre": "Carlos Méndez",
  "Id_TipoDoc": 1,
  "Id_Rol": 2,
  "Correo": "carlos@sigot.com",
  "Password": "mecanic01",
  "Foto": null
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Documento` | string (máx 20) | Sí | Número de documento |
| `Nombre` | string (máx 100) | Sí | Nombre completo |
| `Id_TipoDoc` | integer | Sí | Tipo de documento |
| `Id_Rol` | integer | Sí | Rol del empleado |
| `Correo` | string (email, máx 120) | Sí | Correo electrónico (único) |
| `Password` | string (mín 6 caracteres) | Sí | Contraseña |
| `Foto` | string | No | URL de foto |

---

#### `PUT /api/empleados/:id`

**Descripción:** Actualiza los datos de un empleado.

**Body (ejemplo):**
```json
{
  "Nombre": "Carlos Méndez López",
  "Id_Rol": 3
}
```

---

#### `PATCH /api/empleados/:id/estado`

**Descripción:** Activa o desactiva un empleado.

**Body:**
```json
{ "Estado": 0 }
```

---

### Categorías de Repuesto

Gestión de categorías de repuestos.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/categoria-repuestos`

**Descripción:** Lista todas las categorías.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    { "Id_categoria": 1, "Nombre": "Filtros", "Descripcion": "Filtros de aceite, aire y combustible", "Estado": true }
  ]
}
```

---

#### `GET /api/categoria-repuestos/:id`

**Descripción:** Obtiene una categoría por su ID.

---

#### `POST /api/categoria-repuestos`

**Descripción:** Crea una nueva categoría.

**Body:**
```json
{
  "Nombre": "Filtros",
  "Descripcion": "Filtros de aceite, aire y combustible"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `Nombre` | string | Sí |
| `Descripcion` | string | No |

---

#### `PUT /api/categoria-repuestos/:id`

**Descripción:** Actualiza una categoría.

**Body:**
```json
{
  "Nombre": "Filtros y Aceites",
  "Descripcion": "Filtros y lubricantes"
}
```

---

#### `PATCH /api/categoria-repuestos/:id/estado`

**Descripción:** Activa o desactiva una categoría.

**Body:**
```json
{ "Estado": 0 }
```

---

### Repuestos

Gestión del inventario de repuestos.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/repuestos`

**Descripción:** Lista todos los repuestos activos con su categoría.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Repuesto": 1,
      "NombreRepuesto": "Filtro de aceite",
      "Stock": 10,
      "Precio": 25000,
      "Estado": true,
      "Id_categoria": 1,
      "Categoria": "Filtros"
    }
  ]
}
```

---

#### `GET /api/repuestos/stock`

**Descripción:** Resumen de stock de todos los repuestos (útil para alertas de inventario bajo).

> **Importante:** Esta ruta debe consultarse antes que `GET /api/repuestos/:id` para evitar conflictos de enrutamiento.

---

#### `GET /api/repuestos/:id`

**Descripción:** Obtiene un repuesto por su ID.

---

#### `POST /api/repuestos`

**Descripción:** Crea un nuevo repuesto.

**Body:**
```json
{
  "NombreRepuesto": "Filtro de aceite",
  "Stock": 10,
  "Precio": 25000,
  "Id_categoria": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `NombreRepuesto` | string (máx 120) | Sí | Nombre del repuesto |
| `Stock` | integer (≥ 0) | No | Stock inicial (defecto: 0) |
| `Precio` | decimal positivo | Sí | Precio unitario |
| `Id_categoria` | integer | Sí | ID de la categoría |

---

#### `PUT /api/repuestos/:id`

**Descripción:** Actualiza un repuesto.

**Body (ejemplo):**
```json
{
  "Precio": 27000,
  "Stock": 15
}
```

---

#### `PATCH /api/repuestos/:id/estado`

**Descripción:** Activa o desactiva un repuesto.

**Body:**
```json
{ "Estado": 0 }
```

---

### Proveedores

Gestión de proveedores de repuestos.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/proveedores`

**Descripción:** Lista todos los proveedores activos.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "id_proveedor": 1,
      "Documento": "900123456",
      "TipoProveedor": "Juridico",
      "nombre": "Repuestos El Motor S.A.S",
      "correo": "ventas@elmotor.com",
      "contacto": "3201234567",
      "ciudad": "Bogotá",
      "direccion": "Cra 30 # 45-60",
      "detalles": "Proveedor principal de filtros",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/proveedores/:id`

**Descripción:** Obtiene un proveedor por su ID.

---

#### `POST /api/proveedores`

**Descripción:** Registra un nuevo proveedor.

**Body:**
```json
{
  "Documento": "900123456",
  "TipoProveedor": "Juridico",
  "nombre": "Repuestos El Motor S.A.S",
  "correo": "ventas@elmotor.com",
  "contacto": "3201234567",
  "ciudad": "Bogotá",
  "direccion": "Cra 30 # 45-60",
  "detalles": "Proveedor principal de filtros"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Documento` | string (máx 20) | Sí | NIT o cédula |
| `TipoProveedor` | `"Juridico"` \| `"Natural"` | Sí | Tipo de persona |
| `nombre` | string (máx 120) | Sí | Razón social o nombre |
| `correo` | string (email) | No | Correo de contacto |
| `contacto` | string (máx 20) | No | Teléfono |
| `ciudad` | string (máx 60) | No | Ciudad |
| `direccion` | string (máx 150) | No | Dirección física |
| `detalles` | string (máx 200) | No | Notas adicionales |

---

#### `PUT /api/proveedores/:id`

**Descripción:** Actualiza los datos de un proveedor.

**Body (ejemplo):**
```json
{
  "ciudad": "Medellín",
  "contacto": "3109876543"
}
```

---

#### `PATCH /api/proveedores/:id/estado`

**Descripción:** Activa o desactiva un proveedor.

**Body:**
```json
{ "Estado": 0 }
```

---

### Compras

Registro de compras de repuestos a proveedores. Al crear una compra, el stock de cada repuesto se incrementa automáticamente.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/compras`

**Descripción:** Lista todas las compras activas.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Compra": 1,
      "Fecha_compra": "2026-03-16",
      "id_proveedor": 1,
      "proveedor": "Repuestos El Motor S.A.S",
      "Total": 245000,
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/compras/:id`

**Descripción:** Obtiene una compra por su ID, incluyendo el detalle de repuestos.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": {
    "Id_Compra": 1,
    "Fecha_compra": "2026-03-16",
    "proveedor": "Repuestos El Motor S.A.S",
    "Total": 245000,
    "Estado": true,
    "detalles": [
      {
        "Id_Repuesto": 1,
        "NombreRepuesto": "Filtro de aceite",
        "cantidad": 5,
        "valor_unidad": 22000,
        "subtotal": 110000
      }
    ]
  }
}
```

---

#### `POST /api/compras`

**Descripción:** Registra una nueva compra. Valida que el proveedor y cada `Id_Repuesto` existan. El total y los subtotales se calculan automáticamente. El stock de los repuestos se incrementa en la misma transacción.

**Body:**
```json
{
  "Fecha_compra": "2026-03-16",
  "id_proveedor": 1,
  "detalles": [
    {
      "Id_Repuesto": 1,
      "cantidad": 5,
      "valor_unidad": 22000
    },
    {
      "Id_Repuesto": 2,
      "cantidad": 3,
      "valor_unidad": 45000
    }
  ]
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Fecha_compra` | date (`YYYY-MM-DD`) | Sí | Fecha de la compra |
| `id_proveedor` | integer | Sí | ID del proveedor |
| `detalles` | array (mín 1) | Sí | Líneas de detalle |
| `detalles[].Id_Repuesto` | integer | Sí | ID del repuesto |
| `detalles[].cantidad` | integer (≥ 1) | Sí | Cantidad comprada |
| `detalles[].valor_unidad` | decimal positivo | Sí | Precio unitario de compra |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": {
    "Id_Compra": 7,
    "Fecha_compra": "2026-03-16",
    "id_proveedor": 1,
    "Total": 245000,
    "Estado": true
  }
}
```

**Respuesta de error `404`:**
```json
{ "status": "error", "message": "Repuesto con ID 99 no encontrado" }
```

---

#### `PATCH /api/compras/:id/estado`

**Descripción:** Activa o desactiva una compra.

**Body:**
```json
{ "Estado": 0 }
```

---

### Servicios

Catálogo de servicios que ofrece el taller (mano de obra).
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/servicios`

**Descripción:** Lista todos los servicios activos.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Servicio": 1,
      "Nombre": "Cambio de aceite",
      "Descripcion": "Cambio de aceite de motor y filtro",
      "Precio": 80000,
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/servicios/:id`

**Descripción:** Obtiene un servicio por su ID.

---

#### `POST /api/servicios`

**Descripción:** Crea un nuevo servicio.

**Body:**
```json
{
  "Nombre": "Cambio de aceite",
  "Descripcion": "Cambio de aceite de motor y filtro",
  "Precio": 80000
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Nombre` | string (máx 80) | Sí | Nombre del servicio |
| `Descripcion` | string (máx 200) | No | Descripción del servicio |
| `Precio` | decimal positivo | Sí | Precio de referencia |

---

#### `PUT /api/servicios/:id`

**Descripción:** Actualiza un servicio.

**Body (ejemplo):**
```json
{
  "Precio": 90000,
  "Descripcion": "Cambio de aceite sintético de motor y filtro"
}
```

---

#### `PATCH /api/servicios/:id/estado`

**Descripción:** Activa o desactiva un servicio.

**Body:**
```json
{ "Estado": 0 }
```

---

### Agenda

Gestión de citas del taller. Desde una cita confirmada se puede generar una Orden de Trabajo.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/agenda`

**Descripción:** Lista todas las citas.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Agenda": 1,
      "FechaAgendamiento": "2026-03-20",
      "Hora": "09:00",
      "Cliente": "Juan Pérez",
      "Vehiculo": "ABC123",
      "Empleado": "Carlos Méndez",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/agenda/:id`

**Descripción:** Obtiene una cita por su ID.

---

#### `POST /api/agenda`

**Descripción:** Crea una nueva cita. Valida que el cliente, vehículo y empleado existan.

**Body:**
```json
{
  "Id_Cliente": 1,
  "Id_Vehiculo": 1,
  "id_empleado": 1,
  "FechaAgendamiento": "2026-03-20",
  "Hora": "09:00"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Id_Cliente` | integer | Sí | ID del cliente |
| `Id_Vehiculo` | integer | Sí | ID del vehículo |
| `id_empleado` | integer | Sí | ID del empleado asignado |
| `FechaAgendamiento` | date (`YYYY-MM-DD`) | Sí | Fecha de la cita |
| `Hora` | string (`HH:MM` o `HH:MM:SS`) | Sí | Hora de la cita |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Agenda": 5, "FechaAgendamiento": "2026-03-20", "Hora": "09:00" }
}
```

---

#### `PUT /api/agenda/:id`

**Descripción:** Actualiza una cita. Se puede enviar uno o más campos.

**Body (ejemplo):**
```json
{
  "FechaAgendamiento": "2026-03-22",
  "Hora": "10:30"
}
```

---

#### `PATCH /api/agenda/:id/estado`

**Descripción:** Activa o desactiva una cita.

**Body:**
```json
{ "Estado": 0 }
```

---

#### `POST /api/agenda/:id/orden`

**Descripción:** Genera una Orden de Trabajo a partir de una cita existente. Los datos del cliente, vehículo y empleado se heredan de la cita.

**Body:**
```json
{
  "FechaIngreso": "2026-03-20",
  "FechaEntrega": "2026-03-21",
  "Diagnostico": "Cambio de aceite preventivo",
  "Kilometraje": 45000
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `FechaIngreso` | date | No | Fecha de ingreso del vehículo |
| `FechaEntrega` | date | No | Fecha estimada de entrega |
| `Diagnostico` | string (máx 500) | No | Diagnóstico inicial |
| `Kilometraje` | integer (≥ 0) | No | Kilometraje al ingreso |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": {
    "Id_Orden": 3,
    "Id_Agenda": 1,
    "FechaIngreso": "2026-03-20",
    "FechaEntrega": "2026-03-21",
    "Diagnostico": "Cambio de aceite preventivo",
    "Kilometraje": 45000
  }
}
```

---

### Órdenes de Trabajo

Gestión de órdenes de trabajo. Las órdenes se crean desde el módulo de Agenda. Aquí se agregan los servicios y repuestos utilizados.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/ordenes`

**Descripción:** Lista todas las órdenes de trabajo.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Orden": 1,
      "FechaIngreso": "2026-03-20",
      "FechaEntrega": "2026-03-21",
      "Diagnostico": "Cambio de aceite",
      "Kilometraje": 45000,
      "Cliente": "Juan Pérez",
      "Vehiculo": "ABC123",
      "Empleado": "Carlos Méndez",
      "Estado": true
    }
  ]
}
```

---

#### `GET /api/ordenes/:id`

**Descripción:** Obtiene una orden por su ID, incluyendo servicios y repuestos asociados.

---

#### `PUT /api/ordenes/:id`

**Descripción:** Actualiza los datos de una orden de trabajo.

**Body (ejemplo):**
```json
{
  "Diagnostico": "Cambio de aceite y revisión de frenos",
  "Kilometraje": 45200,
  "FechaEntrega": "2026-03-22"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Diagnostico` | string (máx 500) | No | Diagnóstico del vehículo |
| `Kilometraje` | integer (≥ 0) | No | Kilometraje actualizado |
| `FechaIngreso` | date | No | Fecha de ingreso |
| `FechaEntrega` | date | No | Fecha de entrega |

> Se requiere al menos un campo.

---

#### `PATCH /api/ordenes/:id/estado`

**Descripción:** Activa o desactiva una orden.

**Body:**
```json
{ "Estado": 0 }
```

---

#### `POST /api/ordenes/:id/servicios`

**Descripción:** Agrega un servicio a la orden de trabajo. Valida que el servicio exista.

**Body:**
```json
{
  "Id_Servicio": 1,
  "precio_unitario": 80000
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Id_Servicio` | integer | Sí | ID del servicio |
| `precio_unitario` | decimal positivo | Sí | Precio cobrado al cliente |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Orden": 1, "Id_Servicio": 1, "precio_unitario": 80000, "subtotal": 80000 }
}
```

**Respuesta de error `404`:**
```json
{ "status": "error", "message": "Servicio con ID 99 no encontrado" }
```

---

#### `POST /api/ordenes/:id/repuestos`

**Descripción:** Agrega un repuesto a la orden de trabajo. Valida que el repuesto exista, esté activo y tenga stock suficiente. El stock se descuenta automáticamente.

**Body:**
```json
{
  "Id_Repuesto": 1,
  "cantidad": 1,
  "precio_unitario": 25000
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `Id_Repuesto` | integer | Sí | ID del repuesto |
| `cantidad` | integer (≥ 1) | Sí | Unidades utilizadas |
| `precio_unitario` | decimal positivo | Sí | Precio cobrado al cliente |

**Respuesta exitosa `201`:**
```json
{
  "status": "ok",
  "data": { "Id_Orden": 1, "Id_Repuesto": 1, "cantidad": 1, "precio_unitario": 25000, "subtotal": 25000 }
}
```

**Respuesta de error `400`:**
```json
{ "status": "error", "message": "Stock insuficiente. Disponible: 2, solicitado: 5" }
```

---

### Novedades

Registro de novedades o incidencias de empleados (permisos, incapacidades, etc.).
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/novedades`

**Descripción:** Lista todas las novedades.

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": [
    {
      "Id_Novedad": 1,
      "Empleado": "Carlos Méndez",
      "Descripcion": "Permiso médico por cita odontológica",
      "Fecha_Novedad": "2026-03-16",
      "FechaRealizacion": "2026-03-16"
    }
  ]
}
```

---

#### `GET /api/novedades/:id`

**Descripción:** Obtiene una novedad por su ID.

---

#### `POST /api/novedades`

**Descripción:** Registra una nueva novedad.

**Body:**
```json
{
  "id_empleado": 1,
  "Descripcion": "Permiso médico por cita odontológica",
  "Fecha_Novedad": "2026-03-16",
  "FechaRealizacion": "2026-03-16"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id_empleado` | integer | Sí | ID del empleado |
| `Descripcion` | string (máx 500) | No | Descripción de la novedad |
| `Fecha_Novedad` | date | No | Fecha en que ocurrió |
| `FechaRealizacion` | date | No | Fecha de resolución o atención |

---

#### `PUT /api/novedades/:id`

**Descripción:** Actualiza una novedad.

**Body (ejemplo):**
```json
{
  "Descripcion": "Incapacidad médica por 2 días",
  "FechaRealizacion": "2026-03-17"
}
```

---

### Dashboard

Estadísticas y métricas del sistema para la pantalla principal.
**Autenticación:** Requerida en todos los endpoints.

---

#### `GET /api/dashboard/repuestos`

**Descripción:** Estadísticas del inventario de repuestos (total, stock bajo, valor total, etc.).

**Respuesta exitosa `200`:**
```json
{
  "status": "ok",
  "data": { ... }
}
```

---

#### `GET /api/dashboard/compras`

**Descripción:** Estadísticas de compras (total invertido, compras del mes, etc.).

---

#### `GET /api/dashboard/servicios`

**Descripción:** Estadísticas de servicios (más solicitados, ingresos por servicio, etc.).

---

#### `GET /api/dashboard/empleados`

**Descripción:** Estadísticas de empleados (activos, órdenes atendidas, etc.).

---

## Notas generales

- **Borrado lógico:** Ningún registro se elimina físicamente. Se usa el campo `Estado` (`1` = activo, `0` = inactivo).
- **Transacciones:** Las operaciones de Compras y Órdenes que afectan stock se ejecutan dentro de transacciones SQL para garantizar consistencia.
- **Validación:** Todos los campos son validados con Joi antes de llegar a la base de datos. Los errores de validación retornan `400` con el mensaje descriptivo del campo inválido.
- **Colección Postman:** El archivo `SIGOT_API.postman_collection.json` en la raíz del proyecto contiene todos los endpoints listos para importar.
