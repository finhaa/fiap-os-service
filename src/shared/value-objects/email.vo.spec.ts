import { Email } from './email.vo'

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create email with valid format', () => {
      const email = Email.create('test@example.com')
      expect(email).toBeInstanceOf(Email)
      expect(email.normalized).toBe('test@example.com')
    })

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM')
      expect(email.normalized).toBe('test@example.com')
    })

    it('should normalize email to lowercase and trim', () => {
      const email = Email.create('TEST@EXAMPLE.COM')
      expect(email.normalized).toBe('test@example.com')
    })

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow('Email cannot be empty')
    })

    it('should throw error for whitespace-only email', () => {
      expect(() => Email.create('   ')).toThrow('Email cannot be empty')
    })

    it('should throw error for invalid email format - no @', () => {
      expect(() => Email.create('testexample.com')).toThrow('Invalid email format')
    })

    it('should throw error for invalid email format - no domain', () => {
      expect(() => Email.create('test@')).toThrow('Invalid email format')
    })

    it('should throw error for invalid email format - no local part', () => {
      expect(() => Email.create('@example.com')).toThrow('Invalid email format')
    })

    it('should throw error for invalid email format - no TLD', () => {
      expect(() => Email.create('test@example')).toThrow('Invalid email format')
    })

    it('should throw error for invalid email format - spaces', () => {
      expect(() => Email.create('test @example.com')).toThrow('Invalid email format')
    })
  })

  describe('getters', () => {
    it('should return normalized value', () => {
      const email = Email.create('Test@Example.COM')
      expect(email.normalized).toBe('test@example.com')
    })

    it('should return value', () => {
      const email = Email.create('test@example.com')
      expect(email.value).toBe('test@example.com')
    })
  })

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com')
      const email2 = Email.create('TEST@EXAMPLE.COM')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com')
      const email2 = Email.create('test2@example.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return normalized email string', () => {
      const email = Email.create('Test@Example.COM')
      expect(email.toString()).toBe('test@example.com')
    })
  })
})
