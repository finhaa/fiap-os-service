import { Vin } from './vin.vo'

describe('Vin Value Object', () => {
  const validVin = '1HGBH41JXMN109186' // Valid 17-character VIN

  describe('create', () => {
    it('should create with valid VIN', () => {
      const vin = Vin.create(validVin)
      expect(vin).toBeInstanceOf(Vin)
      expect(vin.clean).toBe(validVin)
    })

    it('should convert to uppercase', () => {
      const vin = Vin.create('1hgbh41jxmn109186')
      expect(vin.clean).toBe(validVin)
    })

    it('should trim whitespace', () => {
      const vin = Vin.create('  1HGBH41JXMN109186  ')
      expect(vin.clean).toBe(validVin)
    })

    it('should throw error for empty VIN', () => {
      expect(() => Vin.create('')).toThrow('VIN cannot be empty')
    })

    it('should throw error for whitespace-only VIN', () => {
      expect(() => Vin.create('   ')).toThrow('VIN cannot be empty')
    })

    it('should throw error for VIN with less than 17 characters', () => {
      expect(() => Vin.create('1HGBH41JXMN10918')).toThrow('VIN must be exactly 17 characters')
    })

    it('should throw error for VIN with more than 17 characters', () => {
      expect(() => Vin.create('1HGBH41JXMN1091866')).toThrow('VIN must be exactly 17 characters')
    })

    it('should throw error for VIN with invalid characters', () => {
      expect(() => Vin.create('1HGBH41JXMN10918@')).toThrow('VIN must contain only alphanumeric characters')
    })

    it('should throw error for VIN containing letter I', () => {
      expect(() => Vin.create('1HGBH4IJXMN109186')).toThrow('VIN cannot contain letters I, O, or Q')
    })

    it('should throw error for VIN containing letter O', () => {
      expect(() => Vin.create('1HGBH4OJXMN109186')).toThrow('VIN cannot contain letters I, O, or Q')
    })

    it('should throw error for VIN containing letter Q', () => {
      expect(() => Vin.create('1HGBH4QJXMN109186')).toThrow('VIN cannot contain letters I, O, or Q')
    })
  })

  describe('getters', () => {
    it('should return clean value', () => {
      const vin = Vin.create(validVin)
      expect(vin.clean).toBe(validVin)
    })

    it('should return formatted value with hyphens', () => {
      const vin = Vin.create(validVin)
      expect(vin.formatted).toBe('1HG-BH41JX-MN109186')
    })
  })

  describe('equals', () => {
    it('should return true for equal VINs', () => {
      const vin1 = Vin.create(validVin)
      const vin2 = Vin.create('1hgbh41jxmn109186')
      expect(vin1.equals(vin2)).toBe(true)
    })

    it('should return false for different VINs', () => {
      const vin1 = Vin.create('1HGBH41JXMN109186')
      const vin2 = Vin.create('2HGBH41JXMN109187')
      expect(vin1.equals(vin2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return clean VIN', () => {
      const vin = Vin.create(validVin)
      expect(vin.toString()).toBe(validVin)
    })
  })
})
