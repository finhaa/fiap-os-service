import { RegisterVehicleUseCase } from './register-vehicle.use-case'
import { Vehicle, IVehicleRepository } from '@domain/vehicles'
import { IClientRepository } from '@domain/clients'
import { CreateVehicleDto } from '../dtos'
import { LicensePlate, Vin } from '@shared/value-objects'

describe('RegisterVehicleUseCase', () => {
  let useCase: RegisterVehicleUseCase
  let vehicleRepository: jest.Mocked<IVehicleRepository>
  let clientRepository: jest.Mocked<IClientRepository>

  beforeEach(() => {
    vehicleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByClientId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByLicensePlate: jest.fn(),
    } as jest.Mocked<IVehicleRepository>

    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<IClientRepository>

    useCase = new RegisterVehicleUseCase(vehicleRepository, clientRepository)
  })

  describe('execute', () => {
    it('should register vehicle successfully with all fields', async () => {
      const dto: CreateVehicleDto = {
        clientId: 'client-123',
        licensePlate: 'ABC1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2023,
        vin: '1HGBH41JXMN109186',
        color: 'Blue',
      }

      const createdVehicle = new Vehicle(
        'vehicle-456',
        LicensePlate.create(dto.licensePlate),
        dto.make,
        dto.model,
        dto.year,
        dto.clientId,
        Vin.create(dto.vin!),
        dto.color,
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue({} as any)
      vehicleRepository.create.mockResolvedValue(createdVehicle)

      const result = await useCase.execute(dto)

      expect(result).toBeDefined()
      expect(result.id).toBe('vehicle-456')
      expect(result.make).toBe('Toyota')
      expect(result.model).toBe('Corolla')
      expect(result.year).toBe(2023)
      expect(result.color).toBe('Blue')
      expect(clientRepository.findById).toHaveBeenCalledWith('client-123')
      expect(vehicleRepository.create).toHaveBeenCalledWith(expect.any(Vehicle))
    })

    it('should register vehicle without optional fields', async () => {
      const dto: CreateVehicleDto = {
        clientId: 'client-123',
        licensePlate: 'XYZ9876',
        make: 'Honda',
        model: 'Civic',
        year: 2022,
      }

      const createdVehicle = new Vehicle(
        'vehicle-789',
        LicensePlate.create(dto.licensePlate),
        dto.make,
        dto.model,
        dto.year,
        dto.clientId,
        undefined,
        undefined,
        new Date(),
        new Date(),
      )

      clientRepository.findById.mockResolvedValue({} as any)
      vehicleRepository.create.mockResolvedValue(createdVehicle)

      const result = await useCase.execute(dto)

      expect(result.vin).toBeUndefined()
      expect(result.color).toBeUndefined()
    })

    it('should throw error when client not found', async () => {
      const dto: CreateVehicleDto = {
        clientId: 'non-existent',
        licensePlate: 'ABC1234',
        make: 'Toyota',
        model: 'Corolla',
        year: 2023,
      }

      clientRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(dto)).rejects.toThrow(
        'Client with ID non-existent not found'
      )
      expect(vehicleRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error for invalid license plate', async () => {
      const dto: CreateVehicleDto = {
        clientId: 'client-123',
        licensePlate: 'INVALID',
        make: 'Toyota',
        model: 'Corolla',
        year: 2023,
      }

      clientRepository.findById.mockResolvedValue({} as any)

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid license plate format')
      expect(vehicleRepository.create).not.toHaveBeenCalled()
    })
  })
})
