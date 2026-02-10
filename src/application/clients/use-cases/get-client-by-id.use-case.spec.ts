import { GetClientByIdUseCase } from './get-client-by-id.use-case'
import { Client, IClientRepository } from '@domain/clients'
import { Email, CpfCnpj } from '@shared/value-objects'

describe('GetClientByIdUseCase', () => {
  let useCase: GetClientByIdUseCase
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

    useCase = new GetClientByIdUseCase(clientRepository)
  })

  describe('execute', () => {
    it('should return client when found', async () => {
      const clientId = 'client-123'
      const mockClient = new Client(
        clientId,
        'John Doe',
        Email.create('john@example.com'),
        CpfCnpj.create('52998224725'),
        '11999999999',
        '123 Main St',
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue(mockClient)

      const result = await useCase.execute(clientId)

      expect(result).toBeDefined()
      expect(result.id).toBe(clientId)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
      expect(clientRepository.findById).toHaveBeenCalledWith(clientId)
    })

    it('should throw error when client not found', async () => {
      const clientId = 'non-existent'

      clientRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(clientId)).rejects.toThrow(
        'Client with ID non-existent not found'
      )
    })
  })
})
