const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const enviarRecuperacionPassword = async (correoDestino, nombre, codigo) => {
  await transporter.sendMail({
    from: `"SIGOT" <${process.env.MAIL_USER}>`,
    to: correoDestino,
    subject: 'Recuperación de contraseña — SIGOT',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Recuperar contraseña</h2>
        <p style="color: #555; margin-bottom: 24px;">Hola <strong>${nombre}</strong>, recibimos una solicitud para restablecer tu contraseña en SIGOT.</p>

        <p style="color: #555; margin-bottom: 8px;">Tu código de verificación es:</p>
        <div style="background: #1a1a1a; color: #f0c040; font-size: 36px; font-weight: bold; letter-spacing: 10px; text-align: center; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          ${codigo}
        </div>

        <p style="color: #999; font-size: 12px;">Ingresa este código en la app para restablecer tu contraseña. <strong>Expira en 15 minutos.</strong></p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste esto, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
        <p style="color: #bbb; font-size: 11px; text-align: center;">SIGOT — Sistema de Gestión de Órdenes de Taller</p>
      </div>
    `,
  });
};

module.exports = { enviarRecuperacionPassword };
