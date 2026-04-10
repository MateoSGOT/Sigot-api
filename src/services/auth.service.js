const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const empleadoModel = require('../models/empleado.model');
const { UnauthorizedError, ConflictError, NotFoundError } = require('../errors/httpErrors');
const { enviarRecuperacionPassword } = require('../utils/mailer');

const login = async (correo, password) => {
  const empleado = await empleadoModel.findByCorreo(correo);

  if (!empleado) {
    throw new UnauthorizedError('Credenciales incorrectas');
  }

  if (!empleado.Estado) {
    throw new UnauthorizedError('Tu cuenta está desactivada');
  }

  const passwordValida = await bcrypt.compare(password, empleado.Password);
  if (!passwordValida) {
    throw new UnauthorizedError('Credenciales incorrectas');
  }

  const token = signToken({
    id_empleado: empleado.id_empleado,
    Nombre: empleado.Nombre,
    Correo: empleado.Correo,
    Id_Rol: empleado.Id_Rol,
    rol: empleado.Rol,
  });

  return {
    token,
    empleado: {
      id_empleado: empleado.id_empleado,
      Nombre: empleado.Nombre,
      Correo: empleado.Correo,
      Id_Rol: empleado.Id_Rol,
      rol: empleado.Rol,
      Foto: empleado.Foto,
    },
  };
};

const registro = async (data) => {
  const existe = await empleadoModel.findByCorreo(data.Correo);
  if (existe) {
    throw new ConflictError('Ya existe un empleado registrado con ese correo');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.Password, salt);

  const nuevoEmpleado = await empleadoModel.create({
    ...data,
    Password: passwordHash,
  });

  const token = signToken({
    id_empleado: nuevoEmpleado.id_empleado,
    Nombre: nuevoEmpleado.Nombre,
    Correo: nuevoEmpleado.Correo,
    Id_Rol: nuevoEmpleado.Id_Rol,
  });

  return { token, empleado: nuevoEmpleado };
};

// JWT es stateless: el cierre de sesión real ocurre en el cliente eliminando el token.
// Este endpoint confirma el logout del lado del servidor.
const logout = async () => {
  return { message: 'Sesión cerrada correctamente' };
};

const recuperarPassword = async (correo) => {
  const empleado = await empleadoModel.findByCorreo(correo);
  if (!empleado) {
    // Respuesta genérica para no revelar si el correo existe
    return { message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña' };
  }

  const tokenRecuperacion = signToken(
    { id_empleado: empleado.id_empleado, Correo: empleado.Correo, tipo: 'recuperacion' },
  );

  await enviarRecuperacionPassword(empleado.Correo, empleado.Nombre, tokenRecuperacion);

  return { message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña' };
};

module.exports = { login, registro, logout, recuperarPassword };
