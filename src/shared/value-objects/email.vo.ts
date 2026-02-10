/**
 * Email value object
 * Encapsulates email validation and normalization
 */
export class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value.toLowerCase().trim()
  }

  /**
   * Create an Email value object
   * @param email - Email string
   * @returns Email instance
   * @throws Error if email is invalid
   */
  public static create(email: string): Email {
    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    return new Email(email)
  }

  /**
   * Get normalized email (lowercase, trimmed)
   */
  get normalized(): string {
    return this._value
  }

  /**
   * Get email value
   */
  get value(): string {
    return this._value
  }

  /**
   * Check equality with another email
   * @param email - Email to compare
   * @returns True if emails are equal
   */
  equals(email: Email): boolean {
    return this._value === email._value
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value
  }
}
