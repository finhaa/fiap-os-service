import { CreateServiceOrderUseCase } from './create-service-order.use-case'
import { ServiceOrder, IServiceOrderRepository } from '@domain/service-orders'
import { Client, IClientRepository } from '@domain/clients'
import { Vehicle, IVehicleRepository } from '@domain/vehicles'
import { IEventPublisher } from '../events/event-publisher.interface'
import { CreateServiceOrderDto } from '../dtos'
import { ServiceOrderStatus } from '@prisma/client'
import { Email, CpfCnpj, LicensePlate } from '@shared/value-objects'

describe('CreateServiceOrderUseCase', () => {
  let useCase: CreateServiceOrderUseCase
  let serviceOrderRepository: jest.Mocked<IServiceOrderRepository>
  let clientRepository: jest.Mocked<IClientRepository>
  let vehicleRepository: jest.Mocked<IVehicleRepository>
  let eventPublisher: jest.Mocked<IEventPublisher>

  const mockClient = new Client(
    'client-123',
    'John Doe',
    Email.create('john@example.com'),
    CpfCnpj.create('52998224725'),
    undefined,
    undefined,
    new Date(),
    new Date(),
  )

  const mockVehicle = new Vehicle(
    'vehicle-456',
    LicensePlate.create('ABC1234'),
    'Toyota',
    'Corolla',
    2023,
    'client-123',
    undefined,
    undefined,
    new Date(),
    new Date(),
  )

  beforeEach(() => {
    serviceOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as jest.Mocked<IServiceOrderRepository>

    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<IClientRepository>

    vehicleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByClientId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByLicensePlate: jest.fn(),
    } as jest.Mocked<IVehicleRepository>

    eventPublisher = {
      publishOrderCreated: jest.fn(),
      publishOrderStatusUpdated: jest.fn(),
    } as jest.Mocked<IEventPublisher>

    useCase = new CreateServiceOrderUseCase(
      serviceOrderRepository,
      clientRepository,
      vehicleRepository,
      eventPublisher,
    )
  })

  describe('execute', () => {
    it('should create service order successfully', async () => {
      const dto: CreateServiceOrderDto = {
        clientId: 'client-123',
        vehicleId: 'vehicle-456',
        notes: 'Oil change needed',
      }

      const createdOrder = new ServiceOrder(
        'order-789',
        ServiceOrderStatus.REQUESTED,
        new Date(),
        undefined,
        undefined,
        dto.notes,
        dto.clientId,
        dto.vehicleId,
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue(mockClient)
      vehicleRepository.findById.mockResolvedValue(mockVehicle)
      serviceOrderRepository.create.mockResolvedValue(createdOrder)

      const result = await useCase.execute(dto)

      expect(result).toEqual({
        id: 'order-789',
        status: ServiceOrderStatus.REQUESTED,
        requestDate: expect.any(Date),
        clientId: 'client-123',
        vehicleId: 'vehicle-456',
        notes: 'Oil change needed',
        createdAt: expect.any(Date),
      })

      expect(clientRepository.findById).toHaveBeenCalledWith('client-123')
      expect(vehicleRepository.findById).toHaveBeenCalledWith('vehicle-456')
      expect(serviceOrderRepository.create).toHaveBeenCalledWith(expect.any(ServiceOrder))
      expect(eventPublisher.publishOrderCreated).toHaveBeenCalledWith({
        orderId: 'order-789',
        clientId: 'client-123',
        vehicleId: 'vehicle-456',
        status: ServiceOrderStatus.REQUESTED,
        requestDate: expect.any(Date),
      })
    })

    it('should create service order without notes', async () => {
      const dto: CreateServiceOrderDto = {
        clientId: 'client-123',
        vehicleId: 'vehicle-456',
      }

      const createdOrder = new ServiceOrder(
        'order-789',
        ServiceOrderStatus.REQUESTED,
        new Date(),
        undefined,
        undefined,
        undefined,
        dto.clientId,
        dto.vehicleId,
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue(mockClient)
      vehicleRepository.findById.mockResolvedValue(mockVehicle)
      serviceOrderRepository.create.mockResolvedValue(createdOrder)

      const result = await useCase.execute(dto)

      expect(result.notes).toBeUndefined()
    })

    it('should throw error when client not found', async () => {
      const dto: CreateServiceOrderDto = {
        clientId: 'non-existent',
        vehicleId: 'vehicle-456',
      }

      clientRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(dto)).rejects.toThrow('Client with ID non-existent not found')

      expect(vehicleRepository.findById).not.toHaveBeenCalled()
      expect(serviceOrderRepository.create).not.toHaveBeenCalled()
      expect(eventPublisher.publishOrderCreated).not.toHaveBeenCalled()
    })

    it('should throw error when vehicle not found', async () => {
      const dto: CreateServiceOrderDto = {
        clientId: 'client-123',
        vehicleId: 'non-existent',
      }

      clientRepository.findById.mockResolvedValue(mockClient)
      vehicleRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(dto)).rejects.toThrow('Vehicle with ID non-existent not found')

      expect(serviceOrderRepository.create).not.toHaveBeenCalled()
      expect(eventPublisher.publishOrderCreated).not.toHaveBeenCalled()
    })

    it('should throw error when vehicle does not belong to client', async () => {
      const dto: CreateServiceOrderDto = {
        clientId: 'client-123',
        vehicleId: 'vehicle-456',
      }

      const otherClientVehicle = new Vehicle(
        'vehicle-456',
        LicensePlate.create('ABC1234'),
        'Toyota',
        'Corolla',
        2023,
        'other-client',
        undefined,
        undefined,
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue(mockClient)
      vehicleRepository.findById.mockResolvedValue(otherClientVehicle)

      await expect(useCase.execute(dto)).rejects.toThrow(
        'Vehicle vehicle-456 does not belong to client client-123'
      )

      expect(serviceOrderRepository.create).not.toHaveBeenCalled()
      expect(eventPublisher.publishOrderCreated).not.toHaveBeenCalled()
    })
  })
})
