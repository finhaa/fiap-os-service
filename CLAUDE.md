# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note**: Do NOT add `Co-Authored-By` to commits in this project.

## Project Overview

OS Service (Service Order Management) - Microservice for FIAP Tech Challenge Phase 4. Manages service orders, clients, vehicles, appointments using DDD architecture with PostgreSQL and EventBridge/SQS for async communication.

## Common Commands

```bash
# Development
npm run start:dev          # Hot reload
npm run start:debug        # With debugger

# Testing
npm test                   # All tests
npm run test:watch         # Watch mode
npm run test:cov           # With coverage
npm run test:e2e           # E2E tests

# Code Quality
npm run lint               # ESLint
npm run format             # Prettier

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Prisma Studio GUI

# Build & Deploy
npm run build              # Production build
docker build -t os-service:local .
kubectl apply -k k8s/overlays/development
```

## Architecture (DDD)

```
src/
├── domain/                # Core business logic
│   ├── service-orders/    # ServiceOrder aggregate
│   ├── clients/           # Client aggregate
│   ├── vehicles/          # Vehicle aggregate
│   ├── appointments/      # Appointment aggregate
│   └── shared/            # Value objects, base entities
├── application/           # Use cases
│   ├── service-orders/    # Order use cases
│   ├── clients/           # Client use cases
│   ├── vehicles/          # Vehicle use cases
│   └── events/            # Event publishers/consumers
├── infra/                 # Infrastructure
│   ├── database/          # Prisma repositories
│   └── messaging/         # EventBridge/SQS
├── interfaces/            # HTTP layer
│   └── rest/              # Controllers
├── shared/                # Cross-cutting concerns
└── config/                # Configuration
```

## Path Aliases

```typescript
import { ServiceOrder } from '@domain/service-orders'
import { CreateServiceOrderUseCase } from '@application/service-orders'
import { PrismaServiceOrderRepository } from '@infra/database'
import { ServiceOrderController } from '@interfaces/rest'
import { BaseEntity } from '@shared/base'
import { AppConfig } from '@config/app.config'
```

## Key Patterns

1. **Entities**: Factory methods (`ServiceOrder.create(clientId, vehicleId)`)
2. **Value Objects**: Validation on creation (`Email.create('test@example.com')`)
3. **Repositories**: Interface in domain, implementation in infra
4. **DI Tokens**: `@Inject(SERVICE_ORDER_REPOSITORY)`
5. **Use Cases**: Single responsibility, one per file

## Event Integration

**Publishes**:
- `OrderCreated` - Triggers budget generation
- `OrderStatusUpdated` - Status changes
- `AppointmentScheduled` - Appointment confirmed

**Consumes**:
- `BudgetGenerated` - From Billing Service
- `BudgetApproved` - From Billing Service
- `PaymentCompleted` - From Billing Service
- `ExecutionCompleted` - From Execution Service

## Database

PostgreSQL via Prisma. Schema in `prisma/schema.prisma`.

Connection via `DATABASE_URL` environment variable.

## Dependencies

- **messaging-infra**: EventBridge bus, SQS queues
- **database-managed-infra**: RDS PostgreSQL (separate from monolith)
- **kubernetes-core-infra**: EKS cluster, namespace `ftc-app`
