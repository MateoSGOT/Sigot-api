// Almacén en memoria para códigos de recuperación de contraseña.
// Cada entrada: { codigo: '123456', expiry: Date }
const _store = new Map();

const EXPIRY_MS = 15 * 60 * 1000; // 15 minutos

const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const guardar = (correo, codigo) => {
  _store.set(correo.toLowerCase(), {
    codigo,
    expiry: new Date(Date.now() + EXPIRY_MS),
  });
};

const verificar = (correo, codigo) => {
  const entry = _store.get(correo.toLowerCase());
  if (!entry) return false;
  if (new Date() > entry.expiry) {
    _store.delete(correo.toLowerCase());
    return false;
  }
  return entry.codigo === codigo;
};

const eliminar = (correo) => {
  _store.delete(correo.toLowerCase());
};

module.exports = { generarCodigo, guardar, verificar, eliminar };
