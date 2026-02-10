/**
 * VIN (Vehicle Identification Number) value object
 * Encapsulates VIN validation and formatting
 * VIN is a 17-character alphanumeric code (excluding I, O, Q)
 */
export class Vin {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value.toUpperCase().trim()
  }

  /**
   * Create a VIN value object
   * @param vin - VIN string
   * @returns Vin instance
   * @throws Error if invalid
   */
  public static create(vin: string): Vin {
    if (!vin || vin.trim() === '') {
      throw new Error('VIN cannot be empty')
    }

    const clean = vin.toUpperCase().trim()

    // VIN must be exactly 17 characters
    if (clean.length !== 17) {
      throw new Error('VIN must be exactly 17 characters')
    }

    // VIN cannot contain I, O, or Q (to avoid confusion with 1, 0)
    if (/[IOQ]/.test(clean)) {
      throw new Error('VIN cannot contain letters I, O, or Q')
    }

    // VIN must be alphanumeric
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) {
      throw new Error('VIN must contain only alphanumeric characters (excluding I, O, Q)')
    }

    return new Vin(clean)
  }

  /**
   * Get clean value
   */
  get clean(): string {
    return this._value
  }

  /**
   * Get formatted value (grouped for readability)
   */
  get formatted(): string {
    return `${this._value.substring(0, 3)}-${this._value.substring(3, 9)}-${this._value.substring(9)}`
  }

  /**
   * Check equality
   */
  equals(vin: Vin): boolean {
    return this._value === vin._value
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value
  }
}
