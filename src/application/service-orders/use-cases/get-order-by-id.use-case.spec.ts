import { GetOrderByIdUseCase } from './get-order-by-id.use-case'
import { ServiceOrder, IServiceOrderRepository } from '@domain/service-orders'
import { ServiceOrderStatus } from '@prisma/client'

describe('GetOrderByIdUseCase', () => {
  let useCase: GetOrderByIdUseCase
  let serviceOrderRepository: jest.Mocked<IServiceOrderRepository>

  beforeEach(() => {
    serviceOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>

    useCase = new GetOrderByIdUseCase(serviceOrderRepository)
  })

  describe('execute', () => {
    it('should return service order when found', async () => {
      const orderId = 'order-123'
      const mockOrder = new ServiceOrder(
        orderId,
        ServiceOrderStatus.REQUESTED,
        new Date(),
        undefined,
        undefined,
        'Test notes',
        'client-123',
        'vehicle-456',
        new Date(),
        new Date(),
      )

      serviceOrderRepository.findById.mockResolvedValue(mockOrder)

      const result = await useCase.execute(orderId)

      expect(result).toBeDefined()
      expect(result.id).toBe(orderId)
      expect(result.status).toBe(ServiceOrderStatus.REQUESTED)
      expect(result.notes).toBe('Test notes')
      expect(serviceOrderRepository.findById).toHaveBeenCalledWith(orderId)
    })

    it('should throw error when order not found', async () => {
      const orderId = 'non-existent'

      serviceOrderRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(orderId)).rejects.toThrow(
        'Service order with ID non-existent not found'
      )
    })
  })
})
