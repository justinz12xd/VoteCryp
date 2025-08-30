export interface FingerprintValidationResult {
  valid: boolean;
  reason?: string;
}

// Validator for Ecuadorian "código dactilar" style: 1 letter, 4 digits, 1 letter, 4 digits
// Example: E1333I1222
export function validateFingerprintCode(raw: string): FingerprintValidationResult {
  const value = (raw || "").trim();
  // Accept both upper/lowercase letters
  const pattern = /^[A-Za-z][0-9]{4}[A-Za-z][0-9]{4}$/;
  if (!pattern.test(value)) {
    return {
      valid: false,
      reason:
        "El código dactilar debe tener el formato Letra-4 dígitos-Letra-4 dígitos (ej: E1333I1222).",
    };
  }
  return { valid: true };
}
