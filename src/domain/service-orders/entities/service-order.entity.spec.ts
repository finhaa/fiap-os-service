import { ServiceOrder } from './service-order.entity'
import { ServiceOrderStatus } from '@prisma/client'
import { InvalidServiceOrderStatusTransitionException } from '../exceptions'

describe('ServiceOrder Entity', () => {
  const clientId = 'client-123'
  const vehicleId = 'vehicle-456'

  describe('create', () => {
    it('should create service order with REQUESTED status', () => {
      const order = ServiceOrder.create(clientId, vehicleId)

      expect(order).toBeInstanceOf(ServiceOrder)
      expect(order.status).toBe(ServiceOrderStatus.REQUESTED)
      expect(order.clientId).toBe(clientId)
      expect(order.vehicleId).toBe(vehicleId)
      expect(order.requestDate).toBeInstanceOf(Date)
      expect(order.deliveryDate).toBeUndefined()
      expect(order.cancellationReason).toBeUndefined()
      expect(order.notes).toBeUndefined()
    })

    it('should create service order with notes', () => {
      const notes = 'Oil change needed'
      const order = ServiceOrder.create(clientId, vehicleId, notes)

      expect(order.notes).toBe(notes)
    })
  })

  describe('createReceived', () => {
    it('should create service order with RECEIVED status', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)

      expect(order.status).toBe(ServiceOrderStatus.RECEIVED)
      expect(order.clientId).toBe(clientId)
      expect(order.vehicleId).toBe(vehicleId)
    })

    it('should create service order with notes', () => {
      const notes = 'Brake inspection'
      const order = ServiceOrder.createReceived(clientId, vehicleId, notes)

      expect(order.notes).toBe(notes)
    })
  })

  describe('status transitions - valid', () => {
    it('should transition from REQUESTED to RECEIVED', () => {
      const order = ServiceOrder.create(clientId, vehicleId)

      order.markReceived()

      expect(order.status).toBe(ServiceOrderStatus.RECEIVED)
    })

    it('should transition from RECEIVED to IN_DIAGNOSIS', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)

      order.markInDiagnosis()

      expect(order.status).toBe(ServiceOrderStatus.IN_DIAGNOSIS)
    })

    it('should transition from IN_DIAGNOSIS to AWAITING_APPROVAL', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()

      order.markAwaitingApproval()

      expect(order.status).toBe(ServiceOrderStatus.AWAITING_APPROVAL)
    })

    it('should transition from AWAITING_APPROVAL to APPROVED', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()

      order.markApproved()

      expect(order.status).toBe(ServiceOrderStatus.APPROVED)
    })

    it('should transition from APPROVED to SCHEDULED', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()

      order.markScheduled()

      expect(order.status).toBe(ServiceOrderStatus.SCHEDULED)
    })

    it('should transition from SCHEDULED to IN_EXECUTION', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()

      order.markInExecution()

      expect(order.status).toBe(ServiceOrderStatus.IN_EXECUTION)
    })

    it('should transition from IN_EXECUTION to FINISHED', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()
      order.markInExecution()

      order.markFinished()

      expect(order.status).toBe(ServiceOrderStatus.FINISHED)
    })

    it('should transition from FINISHED to DELIVERED', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()
      order.markInExecution()
      order.markFinished()

      order.markDelivered()

      expect(order.status).toBe(ServiceOrderStatus.DELIVERED)
    })

    it('should cancel from any non-final status', () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      const reason = 'Customer request'

      order.cancel(reason)

      expect(order.status).toBe(ServiceOrderStatus.CANCELLED)
      expect(order.cancellationReason).toBe(reason)
    })

    it('should reject from AWAITING_APPROVAL', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()

      order.markRejected()

      expect(order.status).toBe(ServiceOrderStatus.REJECTED)
    })
  })

  describe('status transitions - invalid', () => {
    it('should throw error for invalid transition from REQUESTED to IN_DIAGNOSIS', () => {
      const order = ServiceOrder.create(clientId, vehicleId)

      expect(() => {
        order.markInDiagnosis()
      }).toThrow(InvalidServiceOrderStatusTransitionException)
    })

    it('should throw error for invalid transition from DELIVERED to REQUESTED', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()
      order.markInExecution()
      order.markFinished()
      order.markDelivered()

      expect(() => {
        order.updateStatus(ServiceOrderStatus.REQUESTED)
      }).toThrow(InvalidServiceOrderStatusTransitionException)
    })

    it('should throw error for transition from CANCELLED', () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      order.cancel('Test')

      expect(() => {
        order.markReceived()
      }).toThrow(InvalidServiceOrderStatusTransitionException)
    })

    it('should throw error for invalid direct status update', () => {
      const order = ServiceOrder.create(clientId, vehicleId)

      expect(() => {
        order.updateStatus(ServiceOrderStatus.FINISHED)
      }).toThrow(InvalidServiceOrderStatusTransitionException)
    })
  })

  describe('updateDeliveryDate', () => {
    it('should update delivery date', () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      const deliveryDate = new Date('2024-12-31')

      order.updateDeliveryDate(deliveryDate)

      expect(order.deliveryDate).toEqual(deliveryDate)
    })
  })

  describe('updateNotes', () => {
    it('should update notes', () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      const notes = 'New notes'

      order.updateNotes(notes)

      expect(order.notes).toBe(notes)
    })

    it('should replace existing notes', () => {
      const order = ServiceOrder.create(clientId, vehicleId, 'Old notes')

      order.updateNotes('New notes')

      expect(order.notes).toBe('New notes')
    })
  })

  describe('isInFinalState', () => {
    it('should return true for DELIVERED status', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()
      order.markInExecution()
      order.markFinished()
      order.markDelivered()

      expect(order.isInFinalState()).toBe(true)
    })

    it('should return true for CANCELLED status', () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      order.cancel('Test')

      expect(order.isInFinalState()).toBe(true)
    })

    it('should return true for REJECTED status', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markRejected()

      expect(order.isInFinalState()).toBe(true)
    })

    it('should return false for IN_EXECUTION status', () => {
      const order = ServiceOrder.createReceived(clientId, vehicleId)
      order.markInDiagnosis()
      order.markAwaitingApproval()
      order.markApproved()
      order.markScheduled()
      order.markInExecution()

      expect(order.isInFinalState()).toBe(false)
    })

    it('should return false for REQUESTED status', () => {
      const order = ServiceOrder.create(clientId, vehicleId)

      expect(order.isInFinalState()).toBe(false)
    })
  })

  describe('updatedAt timestamp', () => {
    it('should update timestamp on status change', async () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      const originalUpdatedAt = order.updatedAt

      // Wait to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      order.markReceived()

      expect(order.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })

    it('should update timestamp on notes change', async () => {
      const order = ServiceOrder.create(clientId, vehicleId)
      const originalUpdatedAt = order.updatedAt

      await new Promise(resolve => setTimeout(resolve, 10))

      order.updateNotes('New notes')

      expect(order.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })
})
