import { ListClientsUseCase } from './list-clients.use-case'
import { Client, IClientRepository } from '@domain/clients'
import { Email, CpfCnpj } from '@shared/value-objects'

describe('ListClientsUseCase', () => {
  let useCase: ListClientsUseCase
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

    useCase = new ListClientsUseCase(clientRepository)
  })

  describe('execute', () => {
    it('should return list of clients', async () => {
      const mockClients = [
        new Client(
          'client-1',
          'John Doe',
          Email.create('john@example.com'),
          CpfCnpj.create('52998224725'),
          undefined,
          undefined,
          new Date(),
          new Date(),
        ),
        new Client(
          'client-2',
          'Jane Smith',
          Email.create('jane@example.com'),
          CpfCnpj.create('11222333000181'),
          undefined,
          undefined,
          new Date(),
          new Date(),
        ),
      ]

      clientRepository.findAll.mockResolvedValue(mockClients)

      const result = await useCase.execute()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('client-1')
      expect(result[1].id).toBe('client-2')
      expect(clientRepository.findAll).toHaveBeenCalled()
    })

    it('should return empty array when no clients exist', async () => {
      clientRepository.findAll.mockResolvedValue([])

      const result = await useCase.execute()

      expect(result).toEqual([])
      expect(clientRepository.findAll).toHaveBeenCalled()
    })
  })
})
