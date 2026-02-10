import { GetVehicleByIdUseCase } from './get-vehicle-by-id.use-case'
import { Vehicle, IVehicleRepository } from '@domain/vehicles'
import { LicensePlate } from '@shared/value-objects'

describe('GetVehicleByIdUseCase', () => {
  let useCase: GetVehicleByIdUseCase
  let vehicleRepository: jest.Mocked<IVehicleRepository>

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

    useCase = new GetVehicleByIdUseCase(vehicleRepository)
  })

  describe('execute', () => {
    it('should return vehicle when found', async () => {
      const vehicleId = 'vehicle-123'
      const mockVehicle = new Vehicle(
        vehicleId,
        LicensePlate.create('ABC1234'),
        'Toyota',
        'Corolla',
        2023,
        'client-123',
        undefined,
        'Blue',
        new Date(),
        new Date(),
      )

      vehicleRepository.findById.mockResolvedValue(mockVehicle)

      const result = await useCase.execute(vehicleId)

      expect(result).toBeDefined()
      expect(result.id).toBe(vehicleId)
      expect(result.make).toBe('Toyota')
      expect(result.model).toBe('Corolla')
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId)
    })

    it('should throw error when vehicle not found', async () => {
      const vehicleId = 'non-existent'

      vehicleRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(vehicleId)).rejects.toThrow(
        'Vehicle with ID non-existent not found'
      )
    })
  })
})
