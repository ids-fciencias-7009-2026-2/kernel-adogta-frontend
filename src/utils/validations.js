/**
 * Validaciones para formularios
 */

// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El correo electrónico es requerido';
  if (!emailRegex.test(email)) return 'Correo electrónico inválido';
  return null;
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  return null;
};

// Validar confirmación de contraseña
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirmar contraseña es requerido';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden';
  return null;
};

// Validar código postal (México)
export const validateCodigoPostal = (codigoPostal) => {
  if (!codigoPostal) return 'El código postal es requerido';
  if (!/^\d{5}$/.test(codigoPostal)) return 'El código postal debe tener 5 dígitos';
  return null;
};

// Validar teléfono (México)
export const validateTelefono = (telefono) => {
  if (!telefono) return 'El teléfono es requerido';
  if (!/^\d{10}$/.test(telefono)) return 'El teléfono debe tener 10 dígitos';
  return null;
};

// Validar nombre
export const validateNombre = (nombre, fieldName = 'Nombre') => {
  if (!nombre) return `${fieldName} es requerido`;
  if (nombre.length < 2) return `${fieldName} debe tener al menos 2 caracteres`;
  return null;
};

// Validar términos y condiciones
export const validateTerms = (aceptaTerminos) => {
  if (!aceptaTerminos) return 'Debes aceptar los términos y condiciones';
  return null;
};

// Validación del formulario completo de registro
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nombreError = validateNombre(formData.nombres, 'Nombres');
  if (nombreError) errors.nombres = nombreError;
  
  const apellidoPaternoError = validateNombre(formData.apellidoPaterno, 'Apellido paterno');
  if (apellidoPaternoError) errors.apellidoPaterno = apellidoPaternoError;

  const apellidoMaternoError = validateNombre(formData.apellidoMaterno, 'Apellido materno');
  if (apellidoMaternoError) errors.apellidoMaterno = apellidoMaternoError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.contrasena);
  if (passwordError) errors.contrasena = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.contrasena, formData.confirmarContrasena);
  if (confirmPasswordError) errors.confirmarContrasena = confirmPasswordError;
  
  const codigoPostalError = validateCodigoPostal(formData.codigoPostal);
  if (codigoPostalError) errors.codigoPostal = codigoPostalError;
  
  const telefonoError = validateTelefono(formData.telefono);
  if (telefonoError) errors.telefono = telefonoError;
  
  const termsError = validateTerms(formData.aceptaTerminos);
  if (termsError) errors.aceptaTerminos = termsError;
  
  return errors;
};

// Validación del formulario de edición de perfil
export const validateEditProfileForm = (formData) => {
  const errors = {};
  
  const nombreError = validateNombre(formData.nombres, 'Nombres');
  if (nombreError) errors.nombres = nombreError;
  
  const apellidoPaternoError = validateNombre(formData.apellidoPaterno, 'Apellido paterno');
  if (apellidoPaternoError) errors.apellidoPaterno = apellidoPaternoError;

  const apellidoMaternoError = validateNombre(formData.apellidoMaterno, 'Apellido materno');
  if (apellidoMaternoError) errors.apellidoMaterno = apellidoMaternoError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const codigoPostalError = validateCodigoPostal(formData.codigoPostal);
  if (codigoPostalError) errors.codigoPostal = codigoPostalError;
  
  const telefonoError = validateTelefono(formData.telefono);
  if (telefonoError) errors.telefono = telefonoError;
  
  return errors;
};

// Validar formulario de login
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};