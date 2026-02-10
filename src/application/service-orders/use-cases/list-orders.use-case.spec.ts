import { ListOrdersUseCase } from './list-orders.use-case'
import { ServiceOrder, IServiceOrderRepository } from '@domain/service-orders'
import { ServiceOrderStatus } from '@prisma/client'

describe('ListOrdersUseCase', () => {
  let useCase: ListOrdersUseCase
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

    useCase = new ListOrdersUseCase(serviceOrderRepository)
  })

  describe('execute', () => {
    it('should return list of service orders', async () => {
      const mockOrders = [
        new ServiceOrder(
          'order-1',
          ServiceOrderStatus.REQUESTED,
          new Date(),
          undefined,
          undefined,
          undefined,
          'client-1',
          'vehicle-1',
          new Date(),
          new Date(),
        ),
        new ServiceOrder(
          'order-2',
          ServiceOrderStatus.RECEIVED,
          new Date(),
          undefined,
          undefined,
          undefined,
          'client-2',
          'vehicle-2',
          new Date(),
          new Date(),
        ),
      ]

      serviceOrderRepository.findAll.mockResolvedValue(mockOrders)

      const result = await useCase.execute()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('order-1')
      expect(result[1].id).toBe('order-2')
      expect(serviceOrderRepository.findAll).toHaveBeenCalled()
    })

    it('should return empty array when no orders exist', async () => {
      serviceOrderRepository.findAll.mockResolvedValue([])

      const result = await useCase.execute()

      expect(result).toEqual([])
      expect(serviceOrderRepository.findAll).toHaveBeenCalled()
    })
  })
})
