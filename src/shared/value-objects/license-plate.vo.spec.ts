import { LicensePlate } from './license-plate.vo'

describe('LicensePlate Value Object', () => {
  describe('create - old format', () => {
    it('should create with valid old format plate', () => {
      const plate = LicensePlate.create('ABC1234')
      expect(plate).toBeInstanceOf(LicensePlate)
      expect(plate.clean).toBe('ABC1234')
    })

    it('should create with lowercase letters', () => {
      const plate = LicensePlate.create('abc1234')
      expect(plate.clean).toBe('ABC1234')
    })

    it('should create with formatted old format', () => {
      const plate = LicensePlate.create('ABC-1234')
      expect(plate.clean).toBe('ABC1234')
    })

    it('should format old format plate with hyphen', () => {
      const plate = LicensePlate.create('ABC1234')
      expect(plate.formatted).toBe('ABC-1234')
    })

    it('should handle mixed case and spaces', () => {
      const plate = LicensePlate.create('  aBc 1234  ')
      expect(plate.clean).toBe('ABC1234')
    })
  })

  describe('create - Mercosur format', () => {
    it('should create with valid Mercosur format plate', () => {
      const plate = LicensePlate.create('ABC1D23')
      expect(plate).toBeInstanceOf(LicensePlate)
      expect(plate.clean).toBe('ABC1D23')
    })

    it('should create with lowercase Mercosur format', () => {
      const plate = LicensePlate.create('abc1d23')
      expect(plate.clean).toBe('ABC1D23')
    })

    it('should format Mercosur plate without hyphen', () => {
      const plate = LicensePlate.create('ABC1D23')
      expect(plate.formatted).toBe('ABC1D23')
    })
  })

  describe('create - validation', () => {
    it('should throw error for empty plate', () => {
      expect(() => LicensePlate.create('')).toThrow('License plate cannot be empty')
    })

    it('should throw error for whitespace-only plate', () => {
      expect(() => LicensePlate.create('   ')).toThrow('License plate cannot be empty')
    })

    it('should throw error for invalid format - too short', () => {
      expect(() => LicensePlate.create('ABC123')).toThrow('Invalid license plate format')
    })

    it('should throw error for invalid format - too long', () => {
      expect(() => LicensePlate.create('ABC12345')).toThrow('Invalid license plate format')
    })

    it('should throw error for invalid format - all letters', () => {
      expect(() => LicensePlate.create('ABCDEFG')).toThrow('Invalid license plate format')
    })

    it('should throw error for invalid format - all numbers', () => {
      expect(() => LicensePlate.create('1234567')).toThrow('Invalid license plate format')
    })

    it('should throw error for invalid format - wrong pattern', () => {
      expect(() => LicensePlate.create('AB12345')).toThrow('Invalid license plate format')
    })

    it('should throw error for special characters', () => {
      expect(() => LicensePlate.create('ABC@123')).toThrow('Invalid license plate format')
    })
  })

  describe('equals', () => {
    it('should return true for equal old format plates', () => {
      const plate1 = LicensePlate.create('ABC1234')
      const plate2 = LicensePlate.create('abc-1234')
      expect(plate1.equals(plate2)).toBe(true)
    })

    it('should return true for equal Mercosur format plates', () => {
      const plate1 = LicensePlate.create('ABC1D23')
      const plate2 = LicensePlate.create('abc1d23')
      expect(plate1.equals(plate2)).toBe(true)
    })

    it('should return false for different plates', () => {
      const plate1 = LicensePlate.create('ABC1234')
      const plate2 = LicensePlate.create('XYZ9876')
      expect(plate1.equals(plate2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return formatted old format plate', () => {
      const plate = LicensePlate.create('ABC1234')
      expect(plate.toString()).toBe('ABC-1234')
    })

    it('should return formatted Mercosur plate', () => {
      const plate = LicensePlate.create('ABC1D23')
      expect(plate.toString()).toBe('ABC1D23')
    })
  })
})
