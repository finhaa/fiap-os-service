import { Client } from './client.entity'
import { Email, CpfCnpj } from '@shared/value-objects'

describe('Client Entity', () => {
  const validEmail = 'test@example.com'
  const validCpf = '52998224725'
  const validCnpj = '11222333000181'

  describe('create', () => {
    it('should create client with valid CPF', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(client).toBeInstanceOf(Client)
      expect(client.name).toBe('John Doe')
      expect(client.email).toBeInstanceOf(Email)
      expect(client.email.value).toBe(validEmail)
      expect(client.cpfCnpj).toBeInstanceOf(CpfCnpj)
      expect(client.cpfCnpj.clean).toBe(validCpf)
      expect(client.phone).toBeUndefined()
      expect(client.address).toBeUndefined()
    })

    it('should create client with valid CNPJ', () => {
      const client = Client.create('ACME Inc', validEmail, validCnpj)

      expect(client.cpfCnpj.clean).toBe(validCnpj)
      expect(client.cpfCnpj.isCnpj).toBe(true)
    })

    it('should create client with phone and address', () => {
      const client = Client.create(
        'John Doe',
        validEmail,
        validCpf,
        '11999999999',
        '123 Main St'
      )

      expect(client.phone).toBe('11999999999')
      expect(client.address).toBe('123 Main St')
    })

    it('should throw error for invalid email', () => {
      expect(() => {
        Client.create('John Doe', 'invalid-email', validCpf)
      }).toThrow('Invalid email format')
    })

    it('should throw error for invalid CPF', () => {
      expect(() => {
        Client.create('John Doe', validEmail, '12345678901')
      }).toThrow('Invalid CPF')
    })
  })

  describe('updateName', () => {
    it('should update client name', () => {
      const client = Client.create('John Doe', validEmail, validCpf)
      const originalUpdatedAt = client.updatedAt

      // Wait 1ms to ensure timestamp changes
      setTimeout(() => {
        client.updateName('Jane Doe')

        expect(client.name).toBe('Jane Doe')
        expect(client.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime())
      }, 1)
    })
  })

  describe('updateEmail', () => {
    it('should update client email', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      client.updateEmail('newemail@example.com')

      expect(client.email.value).toBe('newemail@example.com')
    })

    it('should throw error for invalid email', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(() => {
        client.updateEmail('invalid-email')
      }).toThrow('Invalid email format')
    })
  })

  describe('updatePhone', () => {
    it('should update client phone', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      client.updatePhone('11988888888')

      expect(client.phone).toBe('11988888888')
    })

    it('should clear phone when undefined', () => {
      const client = Client.create('John Doe', validEmail, validCpf, '11999999999')

      client.updatePhone(undefined)

      expect(client.phone).toBeUndefined()
    })
  })

  describe('updateAddress', () => {
    it('should update client address', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      client.updateAddress('456 Oak Ave')

      expect(client.address).toBe('456 Oak Ave')
    })

    it('should clear address when undefined', () => {
      const client = Client.create('John Doe', validEmail, validCpf, undefined, '123 Main St')

      client.updateAddress(undefined)

      expect(client.address).toBeUndefined()
    })
  })

  describe('hasPhone', () => {
    it('should return true when client has phone', () => {
      const client = Client.create('John Doe', validEmail, validCpf, '11999999999')

      expect(client.hasPhone()).toBe(true)
    })

    it('should return false when client has no phone', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(client.hasPhone()).toBe(false)
    })

    it('should return false when phone is empty string', () => {
      const client = Client.create('John Doe', validEmail, validCpf, '   ')

      expect(client.hasPhone()).toBe(false)
    })
  })

  describe('hasAddress', () => {
    it('should return true when client has address', () => {
      const client = Client.create('John Doe', validEmail, validCpf, undefined, '123 Main St')

      expect(client.hasAddress()).toBe(true)
    })

    it('should return false when client has no address', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(client.hasAddress()).toBe(false)
    })

    it('should return false when address is empty string', () => {
      const client = Client.create('John Doe', validEmail, validCpf, undefined, '   ')

      expect(client.hasAddress()).toBe(false)
    })
  })

  describe('getFormattedCpfCnpj', () => {
    it('should return formatted CPF', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(client.getFormattedCpfCnpj()).toBe('529.982.247-25')
    })

    it('should return formatted CNPJ', () => {
      const client = Client.create('ACME Inc', validEmail, validCnpj)

      expect(client.getFormattedCpfCnpj()).toBe('11.222.333/0001-81')
    })
  })

  describe('getRawCpfCnpj', () => {
    it('should return clean CPF', () => {
      const client = Client.create('John Doe', validEmail, validCpf)

      expect(client.getRawCpfCnpj()).toBe(validCpf)
    })

    it('should return clean CNPJ', () => {
      const client = Client.create('ACME Inc', validEmail, validCnpj)

      expect(client.getRawCpfCnpj()).toBe(validCnpj)
    })
  })

  describe('getNormalizedEmail', () => {
    it('should return normalized email', () => {
      const client = Client.create('John Doe', 'Test@Example.COM', validCpf)

      expect(client.getNormalizedEmail()).toBe('test@example.com')
    })
  })
})
