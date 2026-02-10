import { CreateClientUseCase } from './create-client.use-case'
import { Client, IClientRepository } from '@domain/clients'
import { CreateClientDto } from '../dtos'
import { Email, CpfCnpj } from '@shared/value-objects'

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase
  let clientRepository: jest.Mocked<IClientRepository>

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<IClientRepository>

    useCase = new CreateClientUseCase(clientRepository)
  })

  describe('execute', () => {
    it('should create client successfully', async () => {
      const dto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpfCnpj: '52998224725',
        phone: '11999999999',
        address: '123 Main St',
      }

      const createdClient = new Client(
        'client-123',
        dto.name,
        Email.create(dto.email),
        CpfCnpj.create(dto.cpfCnpj),
        dto.phone,
        dto.address,
        new Date(),
        new Date(),
      )

      clientRepository.create.mockResolvedValue(createdClient)

      const result = await useCase.execute(dto)

      expect(result).toBeDefined()
      expect(result.id).toBe('client-123')
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
      expect(result.phone).toBe('11999999999')
      expect(result.address).toBe('123 Main St')
      expect(clientRepository.create).toHaveBeenCalledWith(expect.any(Client))
    })

    it('should create client without optional fields', async () => {
      const dto: CreateClientDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpfCnpj: '11222333000181',
      }

      const createdClient = new Client(
        'client-456',
        dto.name,
        Email.create(dto.email),
        CpfCnpj.create(dto.cpfCnpj),
        undefined,
        undefined,
        new Date(),
        new Date(),
      )

      clientRepository.create.mockResolvedValue(createdClient)

      const result = await useCase.execute(dto)

      expect(result.phone).toBeUndefined()
      expect(result.address).toBeUndefined()
    })

    it('should throw error for invalid email', async () => {
      const dto: CreateClientDto = {
        name: 'John Doe',
        email: 'invalid-email',
        cpfCnpj: '52998224725',
      }

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid email format')
      expect(clientRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error for invalid CPF', async () => {
      const dto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpfCnpj: '12345678901',
      }

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid CPF')
      expect(clientRepository.create).not.toHaveBeenCalled()
    })
  })
})
