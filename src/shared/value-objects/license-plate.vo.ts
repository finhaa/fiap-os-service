/**
 * License Plate value object
 * Encapsulates Brazilian license plate validation and formatting
 * Supports both old (ABC1234) and Mercosur (ABC1D23) formats
 */
export class LicensePlate {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  }

  /**
   * Create a License Plate value object
   * @param plate - License plate string
   * @returns LicensePlate instance
   * @throws Error if invalid
   */
  public static create(plate: string): LicensePlate {
    if (!plate || plate.trim() === '') {
      throw new Error('License plate cannot be empty')
    }

    const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')

    // Old format: ABC1234 (3 letters + 4 numbers)
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/
    // Mercosur format: ABC1D23 (3 letters + 1 number + 1 letter + 2 numbers)
    const mercosurFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

    if (!oldFormat.test(clean) && !mercosurFormat.test(clean)) {
      throw new Error(
        'Invalid license plate format. Expected ABC1234 or ABC1D23',
      )
    }

    return new LicensePlate(clean)
  }

  /**
   * Get clean value (uppercase, no separators)
   */
  get clean(): string {
    return this._value
  }

  /**
   * Get formatted value (ABC-1234 or ABC1D23)
   */
  get formatted(): string {
    if (/^[A-Z]{3}[0-9]{4}$/.test(this._value)) {
      // Old format with hyphen
      return this._value.replace(/([A-Z]{3})([0-9]{4})/, '$1-$2')
    } else {
      // Mercosur format (no hyphen)
      return this._value
    }
  }

  /**
   * Check equality
   */
  equals(plate: LicensePlate): boolean {
    return this._value === plate._value
  }

  /**
   * String representation
   */
  toString(): string {
    return this.formatted
  }
}
