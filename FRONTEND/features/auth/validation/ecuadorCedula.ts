export type CedulaType = "natural" | "public" | "private" | "foreign" | "unknown";

export interface CedulaValidationResult {
  valid: boolean;
  reason?: string;
  type?: CedulaType;
}

// Clean, framework-agnostic validator for Ecuadorian cédula (10 dígitos, personas naturales)
// Implements módulo 10 and basic province/third digit rules described by the user.
export function validateEcuadorCedula(cedulaRaw: string): CedulaValidationResult {
  const cedula = (cedulaRaw || "").trim();

  if (!/^\d{10}$/.test(cedula)) {
    return { valid: false, reason: "La cédula debe tener exactamente 10 dígitos numéricos.", type: "unknown" };
  }

  const provincia = parseInt(cedula.slice(0, 2), 10);
  const allowedSpecial = new Set([30, 50]); // casos especiales mencionados
  if (!(provincia >= 1 && provincia <= 24) && !allowedSpecial.has(provincia)) {
    return { valid: false, reason: "Código de provincia inválido (01–24, o casos especiales 30/50).", type: "unknown" };
  }

  const tercer = parseInt(cedula[2], 10);
  if (tercer >= 0 && tercer <= 5) {
    // Persona natural: módulo 10
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let num = parseInt(cedula[i], 10);
      // posiciones impares 1,3,5,7,9 -> i 0,2,4,6,8
      if (i % 2 === 0) {
        num *= 2;
        if (num > 9) num -= 9;
      }
      suma += num;
    }
    const verificador = (10 - (suma % 10)) % 10;
    const ok = verificador === parseInt(cedula[9], 10);
    return ok
      ? { valid: true, type: "natural" }
      : { valid: false, reason: "Dígito verificador inválido (módulo 10).", type: "natural" };
  }

  if (tercer === 6) {
    // 6 corresponde a entidades públicas (normalmente RUC 13 dígitos, no cédula)
    return { valid: false, reason: "El tercer dígito 6 corresponde a entidad pública (RUC), no a cédula de 10 dígitos.", type: "public" };
  }

  if (tercer === 9) {
    // 9 corresponde a sociedades privadas (normalmente RUC 13 dígitos, no cédula)
    return { valid: false, reason: "El tercer dígito 9 corresponde a sociedad privada (RUC), no a cédula de 10 dígitos.", type: "private" };
  }

  return { valid: false, reason: "Formato de cédula no reconocido.", type: "unknown" };
}
