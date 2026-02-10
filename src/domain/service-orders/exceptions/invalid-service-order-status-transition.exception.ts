import { ServiceOrderStatus } from '@prisma/client'
import { DomainException } from '@shared/exceptions'

/**
 * Exception thrown when an invalid service order status transition is attempted
 */
export class InvalidServiceOrderStatusTransitionException extends DomainException {
  constructor(
    currentStatus: ServiceOrderStatus,
    newStatus: ServiceOrderStatus,
    allowedStatuses: ServiceOrderStatus[],
  ) {
    const message = `Invalid status transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedStatuses.join(', ')}`
    super(message, 'InvalidServiceOrderStatusTransitionException')
  }
}
