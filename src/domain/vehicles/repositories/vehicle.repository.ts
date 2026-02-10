import { Vehicle } from '../entities'

/**
 * Vehicle repository interface
 * Defines operations for persisting and retrieving vehicles
 */
export interface IVehicleRepository {
  /**
   * Create a new vehicle
   */
  create(vehicle: Vehicle): Promise<Vehicle>

  /**
   * Find vehicle by ID
   */
  findById(id: string): Promise<Vehicle | null>

  /**
   * Find vehicle by license plate
   */
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>

  /**
   * Find all vehicles by client ID
   */
  findByClientId(clientId: string): Promise<Vehicle[]>

  /**
   * Find all vehicles with optional search
   */
  findAll(search?: string): Promise<Vehicle[]>

  /**
   * Update vehicle
   */
  update(id: string, vehicle: Vehicle): Promise<Vehicle>

  /**
   * Delete vehicle
   */
  delete(id: string): Promise<void>
}

export const VEHICLE_REPOSITORY = Symbol('VEHICLE_REPOSITORY')
