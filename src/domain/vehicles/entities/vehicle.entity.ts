import { BaseEntity } from '@shared/base'
import { LicensePlate, Vin } from '@shared/value-objects'

/**
 * Vehicle entity representing a vehicle in the mechanical workshop system
 */
export class Vehicle extends BaseEntity {
  public readonly licensePlate: LicensePlate
  public readonly make: string
  public readonly model: string
  public readonly year: number
  public readonly vin?: Vin
  public readonly color?: string
  public readonly clientId: string

  constructor(
    id: string,
    licensePlate: LicensePlate,
    make: string,
    model: string,
    year: number,
    clientId: string,
    vin?: Vin,
    color?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt)
    this.licensePlate = licensePlate
    this.make = make
    this.model = model
    this.year = year
    this.clientId = clientId
    this.vin = vin
    this.color = color
  }

  /**
   * Create a new Vehicle entity
   */
  public static create(
    licensePlate: string,
    make: string,
    model: string,
    year: number,
    clientId: string,
    vin?: string,
    color?: string,
  ): Vehicle {
    const licensePlateValueObject = LicensePlate.create(licensePlate)
    const vinValueObject = vin ? Vin.create(vin) : undefined
    const now = new Date()

    return new Vehicle(
      '', // ID will be assigned by repository
      licensePlateValueObject,
      make,
      model,
      year,
      clientId,
      vinValueObject,
      color,
      now,
      now,
    )
  }

  /**
   * Updates the license plate of the vehicle
   */
  updateLicensePlate(licensePlate: string): void {
    const licensePlateValueObject = LicensePlate.create(licensePlate)
    Object.assign(this, { licensePlate: licensePlateValueObject })
    this.updateTimestamp()
  }

  /**
   * Updates the make of the vehicle
   */
  updateMake(make: string): void {
    Object.assign(this, { make })
    this.updateTimestamp()
  }

  /**
   * Updates the model of the vehicle
   */
  updateModel(model: string): void {
    Object.assign(this, { model })
    this.updateTimestamp()
  }

  /**
   * Updates the year of the vehicle
   */
  updateYear(year: number): void {
    Object.assign(this, { year })
    this.updateTimestamp()
  }

  /**
   * Updates the VIN of the vehicle
   */
  updateVin(vin?: string): void {
    const vinValueObject = vin ? Vin.create(vin) : undefined
    Object.assign(this, { vin: vinValueObject })
    this.updateTimestamp()
  }

  /**
   * Updates the color of the vehicle
   */
  updateColor(color?: string): void {
    Object.assign(this, { color })
    this.updateTimestamp()
  }

  /**
   * Updates the timestamp to current time
   */
  private updateTimestamp(): void {
    Object.assign(this, { updatedAt: new Date() })
  }

  /**
   * Check if vehicle has a VIN
   */
  public hasVin(): boolean {
    return this.vin !== undefined && this.vin !== null
  }

  /**
   * Check if vehicle has a color
   */
  public hasColor(): boolean {
    return this.color !== undefined && this.color !== null && this.color.trim() !== ''
  }

  /**
   * Get vehicle's formatted license plate
   */
  public getFormattedLicensePlate(): string {
    return this.licensePlate.formatted
  }

  /**
   * Get vehicle's clean license plate
   */
  public getCleanLicensePlate(): string {
    return this.licensePlate.clean
  }

  /**
   * Get vehicle's formatted VIN
   */
  public getFormattedVin(): string | undefined {
    return this.vin?.formatted
  }

  /**
   * Get vehicle's clean VIN
   */
  public getCleanVin(): string | undefined {
    return this.vin?.clean
  }
}
