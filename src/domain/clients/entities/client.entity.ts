import { BaseEntity } from '@shared/base'
import { Email, CpfCnpj } from '@shared/value-objects'

/**
 * Client entity representing a customer in the mechanical workshop system
 */
export class Client extends BaseEntity {
  private _name: string
  private _email: Email
  private _phone?: string
  private readonly _cpfCnpj: CpfCnpj
  private _address?: string

  constructor(
    id: string,
    name: string,
    email: Email,
    cpfCnpj: CpfCnpj,
    phone?: string,
    address?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt)
    this._name = name
    this._email = email
    this._cpfCnpj = cpfCnpj
    this._phone = phone
    this._address = address
  }

  get name(): string {
    return this._name
  }

  get email(): Email {
    return this._email
  }

  get phone(): string | undefined {
    return this._phone
  }

  get cpfCnpj(): CpfCnpj {
    return this._cpfCnpj
  }

  get address(): string | undefined {
    return this._address
  }

  /**
   * Create a new Client entity
   */
  public static create(
    name: string,
    email: string,
    cpfCnpj: string,
    phone?: string,
    address?: string,
  ): Client {
    const emailValueObject = Email.create(email)
    const cpfCnpjValueObject = CpfCnpj.create(cpfCnpj)
    const now = new Date()

    return new Client(
      '', // ID will be assigned by repository
      name,
      emailValueObject,
      cpfCnpjValueObject,
      phone,
      address,
      now,
      now,
    )
  }

  /**
   * Update client name
   */
  public updateName(name: string): void {
    this._name = name
    this.updateTimestamp()
  }

  /**
   * Update client email
   */
  public updateEmail(email: string): void {
    this._email = Email.create(email)
    this.updateTimestamp()
  }

  /**
   * Update client phone
   */
  public updatePhone(phone?: string): void {
    this._phone = phone
    this.updateTimestamp()
  }

  /**
   * Update client address
   */
  public updateAddress(address?: string): void {
    this._address = address
    this.updateTimestamp()
  }

  /**
   * Check if client has a phone number
   */
  public hasPhone(): boolean {
    return this._phone !== undefined && this._phone !== null && this._phone.trim() !== ''
  }

  /**
   * Check if client has an address
   */
  public hasAddress(): boolean {
    return this._address !== undefined && this._address !== null && this._address.trim() !== ''
  }

  /**
   * Get client's formatted CPF or CNPJ
   */
  public getFormattedCpfCnpj(): string {
    return this._cpfCnpj.formatted
  }

  /**
   * Get client's raw CPF/CNPJ (numbers only)
   */
  public getRawCpfCnpj(): string {
    return this._cpfCnpj.clean
  }

  /**
   * Get client's normalized email
   */
  public getNormalizedEmail(): string {
    return this._email.normalized
  }

  /**
   * Updates the timestamp to current time
   */
  private updateTimestamp(): void {
    this.updatedAt = new Date()
  }
}
