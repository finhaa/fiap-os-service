import { CpfCnpj } from './cpf-cnpj.vo'

describe('CpfCnpj Value Object', () => {
  const validCpf = '52998224725' // Valid CPF
  const validCnpj = '11222333000181' // Valid CNPJ

  describe('create - CPF', () => {
    it('should create with valid CPF', () => {
      const cpf = CpfCnpj.create(validCpf)
      expect(cpf).toBeInstanceOf(CpfCnpj)
      expect(cpf.clean).toBe(validCpf)
      expect(cpf.isCpf).toBe(true)
      expect(cpf.isCnpj).toBe(false)
    })

    it('should create with formatted CPF', () => {
      const cpf = CpfCnpj.create('529.982.247-25')
      expect(cpf.clean).toBe(validCpf)
    })

    it('should format CPF correctly', () => {
      const cpf = CpfCnpj.create(validCpf)
      expect(cpf.formatted).toBe('529.982.247-25')
    })

    it('should throw error for invalid CPF checksum', () => {
      expect(() => CpfCnpj.create('12345678901')).toThrow('Invalid CPF')
    })

    it('should throw error for CPF with all same digits', () => {
      expect(() => CpfCnpj.create('11111111111')).toThrow('Invalid CPF')
    })

    it('should throw error for CPF with wrong length', () => {
      expect(() => CpfCnpj.create('123456789')).toThrow('CPF/CNPJ must have 11 or 14 digits')
    })
  })

  describe('create - CNPJ', () => {
    it('should create with valid CNPJ', () => {
      const cnpj = CpfCnpj.create(validCnpj)
      expect(cnpj).toBeInstanceOf(CpfCnpj)
      expect(cnpj.clean).toBe(validCnpj)
      expect(cnpj.isCnpj).toBe(true)
      expect(cnpj.isCpf).toBe(false)
    })

    it('should create with formatted CNPJ', () => {
      const cnpj = CpfCnpj.create('11.222.333/0001-81')
      expect(cnpj.clean).toBe(validCnpj)
    })

    it('should format CNPJ correctly', () => {
      const cnpj = CpfCnpj.create(validCnpj)
      expect(cnpj.formatted).toBe('11.222.333/0001-81')
    })

    it('should throw error for invalid CNPJ checksum', () => {
      expect(() => CpfCnpj.create('12345678000190')).toThrow('Invalid CNPJ')
    })

    it('should throw error for CNPJ with all same digits', () => {
      expect(() => CpfCnpj.create('11111111111111')).toThrow('Invalid CNPJ')
    })
  })

  describe('create - validation', () => {
    it('should throw error for empty value', () => {
      expect(() => CpfCnpj.create('')).toThrow('CPF/CNPJ cannot be empty')
    })

    it('should throw error for whitespace-only value', () => {
      expect(() => CpfCnpj.create('   ')).toThrow('CPF/CNPJ cannot be empty')
    })

    it('should throw error for invalid length', () => {
      expect(() => CpfCnpj.create('123')).toThrow('CPF/CNPJ must have 11 or 14 digits')
    })
  })

  describe('equals', () => {
    it('should return true for equal CPFs', () => {
      const cpf1 = CpfCnpj.create(validCpf)
      const cpf2 = CpfCnpj.create('529.982.247-25')
      expect(cpf1.equals(cpf2)).toBe(true)
    })

    it('should return true for equal CNPJs', () => {
      const cnpj1 = CpfCnpj.create(validCnpj)
      const cnpj2 = CpfCnpj.create('11.222.333/0001-81')
      expect(cnpj1.equals(cnpj2)).toBe(true)
    })

    it('should return false for different values', () => {
      const cpf = CpfCnpj.create(validCpf)
      const cnpj = CpfCnpj.create(validCnpj)
      expect(cpf.equals(cnpj)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return formatted CPF', () => {
      const cpf = CpfCnpj.create(validCpf)
      expect(cpf.toString()).toBe('529.982.247-25')
    })

    it('should return formatted CNPJ', () => {
      const cnpj = CpfCnpj.create(validCnpj)
      expect(cnpj.toString()).toBe('11.222.333/0001-81')
    })
  })
})
