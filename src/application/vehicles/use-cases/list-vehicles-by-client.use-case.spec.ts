import { ListVehiclesByClientUseCase } from './list-vehicles-by-client.use-case'
import { Vehicle, IVehicleRepository } from '@domain/vehicles'
import { LicensePlate } from '@shared/value-objects'

describe('ListVehiclesByClientUseCase', () => {
  let useCase: ListVehiclesByClientUseCase
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

    useCase = new ListVehiclesByClientUseCase(vehicleRepository)
  })

  describe('execute', () => {
    it('should return list of vehicles for client', async () => {
      const clientId = 'client-123'
      const mockVehicles = [
        new Vehicle(
          'vehicle-1',
          LicensePlate.create('ABC1234'),
          'Toyota',
          'Corolla',
          2023,
          clientId,
          undefined,
          undefined,
          new Date(),
          new Date(),
        ),
        new Vehicle(
          'vehicle-2',
          LicensePlate.create('XYZ9876'),
          'Honda',
          'Civic',
          2022,
          clientId,
          undefined,
          undefined,
          new Date(),
          new Date(),
        ),
      ]

      vehicleRepository.findByClientId.mockResolvedValue(mockVehicles)

      const result = await useCase.execute(clientId)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('vehicle-1')
      expect(result[1].id).toBe('vehicle-2')
      expect(vehicleRepository.findByClientId).toHaveBeenCalledWith(clientId)
    })

    it('should return empty array when client has no vehicles', async () => {
      const clientId = 'client-123'

      vehicleRepository.findByClientId.mockResolvedValue([])

      const result = await useCase.execute(clientId)

      expect(result).toEqual([])
      expect(vehicleRepository.findByClientId).toHaveBeenCalledWith(clientId)
    })
  })
})
