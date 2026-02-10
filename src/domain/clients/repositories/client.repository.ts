import { Client } from '../entities'

/**
 * Client repository interface
 * Defines operations for persisting and retrieving clients
 */
export interface IClientRepository {
  /**
   * Create a new client
   */
  create(client: Client): Promise<Client>

  /**
   * Find client by ID
   */
  findById(id: string): Promise<Client | null>

  /**
   * Find client by email
   */
  findByEmail(email: string): Promise<Client | null>

  /**
   * Find client by CPF/CNPJ
   */
  findByCpfCnpj(cpfCnpj: string): Promise<Client | null>

  /**
   * Find all clients with optional search
   */
  findAll(search?: string): Promise<Client[]>

  /**
   * Update client
   */
  update(id: string, client: Client): Promise<Client>

  /**
   * Delete client
   */
  delete(id: string): Promise<void>
}

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY')
