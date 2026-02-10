import { ServiceOrderStatus } from '@prisma/client'
import { BaseEntity } from '@shared/base'
import { InvalidServiceOrderStatusTransitionException } from '../exceptions'

/**
 * ServiceOrder aggregate root
 * Represents a service order in the mechanical workshop system
 */
export class ServiceOrder extends BaseEntity {
  public readonly status: ServiceOrderStatus
  public readonly requestDate: Date
  public readonly deliveryDate?: Date
  public readonly cancellationReason?: string
  public readonly notes?: string
  public readonly clientId: string
  public readonly vehicleId: string

  constructor(
    id: string,
    status: ServiceOrderStatus,
    requestDate: Date,
    deliveryDate: Date | undefined,
    cancellationReason: string | undefined,
    notes: string | undefined,
    clientId: string,
    vehicleId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt)
    this.status = status
    this.requestDate = requestDate
    this.deliveryDate = deliveryDate
    this.cancellationReason = cancellationReason
    this.notes = notes
    this.clientId = clientId
    this.vehicleId = vehicleId
  }

  /**
   * Factory method to create a new service order with REQUESTED status
   */
  public static create(clientId: string, vehicleId: string, notes?: string): ServiceOrder {
    const now = new Date()
    return new ServiceOrder(
      '',
      ServiceOrderStatus.REQUESTED,
      now,
      undefined,
      undefined,
      notes,
      clientId,
      vehicleId,
      now,
      now,
    )
  }

  /**
   * Factory to create a service order with RECEIVED status (for employee creation)
   */
  public static createReceived(clientId: string, vehicleId: string, notes?: string): ServiceOrder {
    const now = new Date()
    return new ServiceOrder(
      '',
      ServiceOrderStatus.RECEIVED,
      now,
      undefined,
      undefined,
      notes,
      clientId,
      vehicleId,
      now,
      now,
    )
  }

  /**
   * Validates if a status transition is allowed
   */
  private validateStatusTransition(newStatus: ServiceOrderStatus): void {
    const allowedTransitions: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
      [ServiceOrderStatus.REQUESTED]: [
        ServiceOrderStatus.RECEIVED,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.RECEIVED]: [
        ServiceOrderStatus.IN_DIAGNOSIS,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.IN_DIAGNOSIS]: [
        ServiceOrderStatus.AWAITING_APPROVAL,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.AWAITING_APPROVAL]: [
        ServiceOrderStatus.APPROVED,
        ServiceOrderStatus.REJECTED,
        ServiceOrderStatus.CANCELLED,
      ],
      [ServiceOrderStatus.APPROVED]: [
        ServiceOrderStatus.SCHEDULED,
        ServiceOrderStatus.IN_EXECUTION,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.REJECTED]: [ServiceOrderStatus.CANCELLED],
      [ServiceOrderStatus.SCHEDULED]: [
        ServiceOrderStatus.IN_EXECUTION,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.IN_EXECUTION]: [
        ServiceOrderStatus.FINISHED,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.FINISHED]: [
        ServiceOrderStatus.DELIVERED,
        ServiceOrderStatus.CANCELLED,
        ServiceOrderStatus.REJECTED,
      ],
      [ServiceOrderStatus.DELIVERED]: [ServiceOrderStatus.CANCELLED, ServiceOrderStatus.REJECTED],
      [ServiceOrderStatus.CANCELLED]: [],
    }

    const allowedStatuses = allowedTransitions[this.status]
    if (!allowedStatuses.includes(newStatus)) {
      throw new InvalidServiceOrderStatusTransitionException(
        this.status,
        newStatus,
        allowedStatuses,
      )
    }
  }

  /**
   * Mark order as received
   */
  public markReceived(): void {
    this.validateStatusTransition(ServiceOrderStatus.RECEIVED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.RECEIVED
    this.updatedAt = new Date()
  }

  /**
   * Mark order as in diagnosis
   */
  public markInDiagnosis(): void {
    this.validateStatusTransition(ServiceOrderStatus.IN_DIAGNOSIS)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.IN_DIAGNOSIS
    this.updatedAt = new Date()
  }

  /**
   * Mark order as awaiting approval
   */
  public markAwaitingApproval(): void {
    this.validateStatusTransition(ServiceOrderStatus.AWAITING_APPROVAL)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.AWAITING_APPROVAL
    this.updatedAt = new Date()
  }

  /**
   * Mark order as approved
   */
  public markApproved(): void {
    this.validateStatusTransition(ServiceOrderStatus.APPROVED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.APPROVED
    this.updatedAt = new Date()
  }

  /**
   * Mark order as rejected
   */
  public markRejected(): void {
    this.validateStatusTransition(ServiceOrderStatus.REJECTED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.REJECTED
    this.updatedAt = new Date()
  }

  /**
   * Mark order as scheduled
   */
  public markScheduled(): void {
    this.validateStatusTransition(ServiceOrderStatus.SCHEDULED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.SCHEDULED
    this.updatedAt = new Date()
  }

  /**
   * Mark order as in execution
   */
  public markInExecution(): void {
    this.validateStatusTransition(ServiceOrderStatus.IN_EXECUTION)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.IN_EXECUTION
    this.updatedAt = new Date()
  }

  /**
   * Mark order as finished
   */
  public markFinished(): void {
    this.validateStatusTransition(ServiceOrderStatus.FINISHED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.FINISHED
    this.updatedAt = new Date()
  }

  /**
   * Mark order as delivered
   */
  public markDelivered(): void {
    this.validateStatusTransition(ServiceOrderStatus.DELIVERED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.DELIVERED
    this.updatedAt = new Date()
  }

  /**
   * Cancel order with reason
   */
  public cancel(reason: string): void {
    this.validateStatusTransition(ServiceOrderStatus.CANCELLED)
    ;(this as { status: ServiceOrderStatus }).status = ServiceOrderStatus.CANCELLED
    ;(this as { cancellationReason: string }).cancellationReason = reason
    this.updatedAt = new Date()
  }

  /**
   * Update service order with new status
   */
  public updateStatus(status: ServiceOrderStatus): void {
    this.validateStatusTransition(status)
    ;(this as { status: ServiceOrderStatus }).status = status
    this.updatedAt = new Date()
  }

  /**
   * Update delivery date
   */
  public updateDeliveryDate(deliveryDate: Date): void {
    ;(this as { deliveryDate: Date }).deliveryDate = deliveryDate
    this.updatedAt = new Date()
  }

  /**
   * Update notes
   */
  public updateNotes(notes: string): void {
    ;(this as { notes: string }).notes = notes
    this.updatedAt = new Date()
  }

  /**
   * Check if the service order is in a final state
   */
  public isInFinalState(): boolean {
    const finalStates = [
      ServiceOrderStatus.DELIVERED,
      ServiceOrderStatus.CANCELLED,
      ServiceOrderStatus.REJECTED,
    ] as ServiceOrderStatus[]
    return finalStates.includes(this.status)
  }
}
