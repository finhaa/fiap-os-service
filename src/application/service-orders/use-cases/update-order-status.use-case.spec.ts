import { UpdateOrderStatusUseCase } from './update-order-status.use-case'
import { ServiceOrder, IServiceOrderRepository } from '@domain/service-orders'
import { IEventPublisher } from '../events/event-publisher.interface'
import { UpdateServiceOrderStatusDto } from '../dtos'
import { ServiceOrderStatus } from '@prisma/client'
import { InvalidServiceOrderStatusTransitionException } from '@domain/service-orders/exceptions'

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase
  let serviceOrderRepository: jest.Mocked<IServiceOrderRepository>
  let eventPublisher: jest.Mocked<IEventPublisher>

  beforeEach(() => {
    serviceOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>

    eventPublisher = {
      publishOrderCreated: jest.fn(),
      publishOrderStatusUpdated: jest.fn(),
    } as jest.Mocked<IEventPublisher>

    useCase = new UpdateOrderStatusUseCase(serviceOrderRepository, eventPublisher)
  })

  describe('execute', () => {
    it('should update service order status successfully', async () => {
      const orderId = 'order-123'
      const dto: UpdateServiceOrderStatusDto = {
        status: ServiceOrderStatus.RECEIVED,
      }

      const existingOrder = new ServiceOrder(
        orderId,
        ServiceOrderStatus.REQUESTED,
        new Date(),
        undefined,
        undefined,
        undefined,
        'client-123',
        'vehicle-456',
        new Date(),
        new Date(),
      )

      const updatedOrder = new ServiceOrder(
        orderId,
        ServiceOrderStatus.RECEIVED,
        existingOrder.requestDate,
        existingOrder.deliveryDate,
        existingOrder.cancellationReason,
        existingOrder.notes,
        existingOrder.clientId,
        existingOrder.vehicleId,
        existingOrder.createdAt,
        new Date(),
      )

      serviceOrderRepository.findById.mockResolvedValue(existingOrder)
      serviceOrderRepository.update.mockResolvedValue(updatedOrder)

      const result = await useCase.execute(orderId, dto)

      expect(result.status).toBe(ServiceOrderStatus.RECEIVED)
      expect(serviceOrderRepository.findById).toHaveBeenCalledWith(orderId)
      expect(serviceOrderRepository.update).toHaveBeenCalled()
      expect(eventPublisher.publishOrderStatusUpdated).toHaveBeenCalledWith({
        orderId,
        status: ServiceOrderStatus.RECEIVED,
        updatedAt: expect.any(Date),
      })
    })

    it('should throw error when order not found', async () => {
      const orderId = 'non-existent'
      const dto: UpdateServiceOrderStatusDto = {
        status: ServiceOrderStatus.RECEIVED,
      }

      serviceOrderRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(orderId, dto)).rejects.toThrow(
        'Service order with ID non-existent not found'
      )

      expect(serviceOrderRepository.update).not.toHaveBeenCalled()
      expect(eventPublisher.publishOrderStatusUpdated).not.toHaveBeenCalled()
    })

    it('should throw error for invalid status transition', async () => {
      const orderId = 'order-123'
      const dto: UpdateServiceOrderStatusDto = {
        status: ServiceOrderStatus.FINISHED, // Invalid from REQUESTED
      }

      const existingOrder = new ServiceOrder(
        orderId,
        ServiceOrderStatus.REQUESTED,
        new Date(),
        undefined,
        undefined,
        undefined,
        'client-123',
        'vehicle-456',
        new Date(),
        new Date(),
      )

      serviceOrderRepository.findById.mockResolvedValue(existingOrder)

      await expect(useCase.execute(orderId, dto)).rejects.toThrow(
        InvalidServiceOrderStatusTransitionException
      )

      expect(serviceOrderRepository.update).not.toHaveBeenCalled()
      expect(eventPublisher.publishOrderStatusUpdated).not.toHaveBeenCalled()
    })
  })
})
