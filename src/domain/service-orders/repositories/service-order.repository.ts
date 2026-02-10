import { ServiceOrder } from '../entities'
import { ServiceOrderStatus } from '@prisma/client'

/**
 * ServiceOrder repository interface
 * Defines operations for persisting and retrieving service orders
 */
export interface IServiceOrderRepository {
  /**
   * Create a new service order
   */
  create(serviceOrder: ServiceOrder): Promise<ServiceOrder>

  /**
   * Find service order by ID
   */
  findById(id: string): Promise<ServiceOrder | null>

  /**
   * Find all service orders with optional filters
   */
  findAll(filters?: {
    clientId?: string
    vehicleId?: string
    status?: ServiceOrderStatus
    fromDate?: Date
    toDate?: Date
  }): Promise<ServiceOrder[]>

  /**
   * Update service order
   */
  update(id: string, serviceOrder: ServiceOrder): Promise<ServiceOrder>

  /**
   * Delete service order
   */
  delete(id: string): Promise<void>

  /**
   * Count service orders with optional filters
   */
  count(filters?: {
    clientId?: string
    vehicleId?: string
    status?: ServiceOrderStatus
  }): Promise<number>
}

export const SERVICE_ORDER_REPOSITORY = Symbol('SERVICE_ORDER_REPOSITORY')
