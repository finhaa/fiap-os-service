import { Vehicle } from './vehicle.entity'
import { LicensePlate, Vin } from '@shared/value-objects'

describe('Vehicle Entity', () => {
  const validPlate = 'ABC1234'
  const validVin = '1HGBH41JXMN109186'
  const clientId = 'client-123'

  describe('create', () => {
    it('should create vehicle with required fields', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle).toBeInstanceOf(Vehicle)
      expect(vehicle.licensePlate).toBeInstanceOf(LicensePlate)
      expect(vehicle.licensePlate.clean).toBe(validPlate)
      expect(vehicle.make).toBe('Toyota')
      expect(vehicle.model).toBe('Corolla')
      expect(vehicle.year).toBe(2023)
      expect(vehicle.clientId).toBe(clientId)
      expect(vehicle.vin).toBeUndefined()
      expect(vehicle.color).toBeUndefined()
    })

    it('should create vehicle with VIN and color', () => {
      const vehicle = Vehicle.create(
        validPlate,
        'Toyota',
        'Corolla',
        2023,
        clientId,
        validVin,
        'Blue'
      )

      expect(vehicle.vin).toBeInstanceOf(Vin)
      expect(vehicle.vin?.clean).toBe(validVin)
      expect(vehicle.color).toBe('Blue')
    })

    it('should throw error for invalid license plate', () => {
      expect(() => {
        Vehicle.create('INVALID', 'Toyota', 'Corolla', 2023, clientId)
      }).toThrow('Invalid license plate format')
    })

    it('should throw error for invalid VIN', () => {
      expect(() => {
        Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, 'INVALID')
      }).toThrow('VIN must be exactly 17 characters')
    })
  })

  describe('updateLicensePlate', () => {
    it('should update license plate', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateLicensePlate('XYZ9876')

      expect(vehicle.licensePlate.clean).toBe('XYZ9876')
    })

    it('should throw error for invalid license plate', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(() => {
        vehicle.updateLicensePlate('INVALID')
      }).toThrow('Invalid license plate format')
    })
  })

  describe('updateMake', () => {
    it('should update vehicle make', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateMake('Honda')

      expect(vehicle.make).toBe('Honda')
    })
  })

  describe('updateModel', () => {
    it('should update vehicle model', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateModel('Camry')

      expect(vehicle.model).toBe('Camry')
    })
  })

  describe('updateYear', () => {
    it('should update vehicle year', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateYear(2024)

      expect(vehicle.year).toBe(2024)
    })
  })

  describe('updateVin', () => {
    it('should update vehicle VIN', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateVin(validVin)

      expect(vehicle.vin).toBeInstanceOf(Vin)
      expect(vehicle.vin?.clean).toBe(validVin)
    })

    it('should clear VIN when undefined', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, validVin)

      vehicle.updateVin(undefined)

      expect(vehicle.vin).toBeUndefined()
    })

    it('should throw error for invalid VIN', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(() => {
        vehicle.updateVin('INVALID')
      }).toThrow('VIN must be exactly 17 characters')
    })
  })

  describe('updateColor', () => {
    it('should update vehicle color', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      vehicle.updateColor('Red')

      expect(vehicle.color).toBe('Red')
    })

    it('should clear color when undefined', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, undefined, 'Blue')

      vehicle.updateColor(undefined)

      expect(vehicle.color).toBeUndefined()
    })
  })

  describe('hasVin', () => {
    it('should return true when vehicle has VIN', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, validVin)

      expect(vehicle.hasVin()).toBe(true)
    })

    it('should return false when vehicle has no VIN', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.hasVin()).toBe(false)
    })
  })

  describe('hasColor', () => {
    it('should return true when vehicle has color', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, undefined, 'Blue')

      expect(vehicle.hasColor()).toBe(true)
    })

    it('should return false when vehicle has no color', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.hasColor()).toBe(false)
    })

    it('should return false when color is empty string', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, undefined, '   ')

      expect(vehicle.hasColor()).toBe(false)
    })
  })

  describe('getFormattedLicensePlate', () => {
    it('should return formatted old format license plate', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.getFormattedLicensePlate()).toBe('ABC-1234')
    })

    it('should return formatted Mercosur license plate', () => {
      const vehicle = Vehicle.create('ABC1D23', 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.getFormattedLicensePlate()).toBe('ABC1D23')
    })
  })

  describe('getCleanLicensePlate', () => {
    it('should return clean license plate', () => {
      const vehicle = Vehicle.create('abc-1234', 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.getCleanLicensePlate()).toBe('ABC1234')
    })
  })

  describe('getFormattedVin', () => {
    it('should return formatted VIN when present', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, validVin)

      expect(vehicle.getFormattedVin()).toBe('1HG-BH41JX-MN109186')
    })

    it('should return undefined when VIN not present', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.getFormattedVin()).toBeUndefined()
    })
  })

  describe('getCleanVin', () => {
    it('should return clean VIN when present', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId, validVin)

      expect(vehicle.getCleanVin()).toBe(validVin)
    })

    it('should return undefined when VIN not present', () => {
      const vehicle = Vehicle.create(validPlate, 'Toyota', 'Corolla', 2023, clientId)

      expect(vehicle.getCleanVin()).toBeUndefined()
    })
  })
})
