/**
 * CPF/CNPJ value object
 * Encapsulates Brazilian taxpayer ID validation and formatting
 */
export class CpfCnpj {
  private readonly _value: string
  private readonly _isCpf: boolean

  private constructor(value: string) {
    this._value = value.replace(/\D/g, '')
    this._isCpf = this._value.length === 11
  }

  /**
   * Create a CPF/CNPJ value object
   * @param value - CPF or CNPJ string
   * @returns CpfCnpj instance
   * @throws Error if invalid
   */
  public static create(value: string): CpfCnpj {
    if (!value || value.trim() === '') {
      throw new Error('CPF/CNPJ cannot be empty')
    }

    const clean = value.replace(/\D/g, '')

    if (clean.length === 11) {
      if (!CpfCnpj.validateCpf(clean)) {
        throw new Error('Invalid CPF')
      }
    } else if (clean.length === 14) {
      if (!CpfCnpj.validateCnpj(clean)) {
        throw new Error('Invalid CNPJ')
      }
    } else {
      throw new Error('CPF/CNPJ must have 11 or 14 digits')
    }

    return new CpfCnpj(clean)
  }

  /**
   * Validate CPF
   */
  private static validateCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    return digit === parseInt(cpf.charAt(10))
  }

  /**
   * Validate CNPJ
   */
  private static validateCnpj(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false
    }

    let size = cnpj.length - 2
    let numbers = cnpj.substring(0, size)
    const digits = cnpj.substring(size)
    let sum = 0
    let pos = size - 7

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(0))) return false

    size = size + 1
    numbers = cnpj.substring(0, size)
    sum = 0
    pos = size - 7

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return result === parseInt(digits.charAt(1))
  }

  /**
   * Get clean value (numbers only)
   */
  get clean(): string {
    return this._value
  }

  /**
   * Get formatted value
   */
  get formatted(): string {
    if (this._isCpf) {
      return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return this._value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  /**
   * Check if it's a CPF
   */
  get isCpf(): boolean {
    return this._isCpf
  }

  /**
   * Check if it's a CNPJ
   */
  get isCnpj(): boolean {
    return !this._isCpf
  }

  /**
   * Check equality
   */
  equals(cpfCnpj: CpfCnpj): boolean {
    return this._value === cpfCnpj._value
  }

  /**
   * String representation
   */
  toString(): string {
    return this.formatted
  }
}
