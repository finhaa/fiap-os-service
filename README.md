# OS Service

Service Order Management Microservice for FIAP Tech Challenge Phase 4.

## Overview

The OS Service (Order Service) manages the service order lifecycle, client and vehicle management, appointments, and availability scheduling. It's the first microservice in the Phase 4 architecture and handles all operations related to service requests.

## Responsibilities

- Service order lifecycle management (CRUD)
- Client and vehicle management
- Service order status tracking and history
- Appointments and availability management
- Vehicle evaluations
- Event publishing for saga orchestration

## Architecture

Built with **Domain-Driven Design (DDD)** principles:

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

## Technology Stack

- **Runtime**: Node.js 20 + TypeScript 5
- **Framework**: NestJS 11
- **Database**: PostgreSQL (RDS)
- **ORM**: Prisma 6
- **Messaging**: AWS EventBridge + SQS
- **Deployment**: Kubernetes (EKS)
- **Architecture**: Domain-Driven Design

## Domain Entities

### ServiceOrder (Aggregate Root)
Represents a service request from a client for their vehicle.

**States**: REQUESTED → RECEIVED → IN_DIAGNOSIS → AWAITING_APPROVAL → APPROVED → IN_EXECUTION → FINISHED → DELIVERED

**Relationships**:
- Belongs to one Client
- Belongs to one Vehicle
- Has one Budget (managed by Billing Service)
- Has one ServiceExecution (managed by Execution Service)

### Client
Represents a customer of the workshop.

**Properties**: Name, Email, CPF/CNPJ, Phone, Address

### Vehicle
Represents a client's vehicle.

**Properties**: License Plate, Make, Model, Year, VIN, Color, Client

### Appointment
Represents a scheduled service appointment.

**Properties**: Date/Time, Client, Vehicle, Status

### VehicleEvaluation
Represents an evaluation of vehicle condition.

**Properties**: Evaluation notes, Photos, Condition assessment

## API Endpoints

### Service Orders

```
POST   /api/v1/service-orders          - Create service order
GET    /api/v1/service-orders/:id      - Get order details
GET    /api/v1/service-orders          - List/search orders
PATCH  /api/v1/service-orders/:id/status - Update order status
POST   /api/v1/service-orders/:id/cancel - Cancel order
```

### Clients

```
POST   /api/v1/clients                 - Register new client
GET    /api/v1/clients/:id             - Get client details
GET    /api/v1/clients                 - List clients
PATCH  /api/v1/clients/:id             - Update client
```

### Vehicles

```
POST   /api/v1/vehicles                - Register vehicle
GET    /api/v1/vehicles/:id            - Get vehicle details
GET    /api/v1/vehicles                - List vehicles by client
PATCH  /api/v1/vehicles/:id            - Update vehicle
```

### Appointments

```
POST   /api/v1/appointments            - Schedule appointment
GET    /api/v1/appointments/availability - Check availability
GET    /api/v1/appointments/:id        - Get appointment details
PATCH  /api/v1/appointments/:id        - Update appointment
```

## Events

### Published Events

- **OrderCreated**: When a new service order is created (triggers budget generation in Billing Service)
- **OrderStatusUpdated**: When order status changes
- **AppointmentScheduled**: When an appointment is confirmed

### Consumed Events

- **BudgetGenerated**: Update order with budget info (from Billing Service)
- **BudgetApproved**: Update order status to approved (from Billing Service)
- **PaymentCompleted**: Update order status to scheduled (from Billing Service)
- **ExecutionCompleted**: Update order to finished (from Execution Service)

## Database Schema

PostgreSQL schema managed by Prisma:

```prisma
model ServiceOrder {
  id                   String              @id @default(uuid())
  status               ServiceOrderStatus  @default(REQUESTED)
  requestDate          DateTime            @default(now())
  deliveryDate         DateTime?
  cancellationReason   String?
  notes                String?
  clientId             String
  vehicleId            String
  client               Client              @relation(fields: [clientId], references: [id])
  vehicle              Vehicle             @relation(fields: [vehicleId], references: [id])
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
}

model Client {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  cpfCnpj       String         @unique
  phone         String?
  address       String?
  vehicles      Vehicle[]
  serviceOrders ServiceOrder[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Vehicle {
  id            String         @id @default(uuid())
  licensePlate  String         @unique
  make          String
  model         String
  year          Int
  vin           String?
  color         String?
  clientId      String
  client        Client         @relation(fields: [clientId], references: [id])
  serviceOrders ServiceOrder[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15 (or Docker Compose for local dev)
- AWS credentials configured

### Local Development

```bash
# Install dependencies
npm install

# Set up database (uses docker-compose from root)
cd .. && docker-compose up -d postgres-os

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

Server runs on `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

### Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Build

```bash
# Production build
npm run build

# Run production build
npm run start:prod
```

## Deployment

### Docker

```bash
# Build image
docker build -t os-service:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AWS_REGION="us-east-1" \
  os-service:latest
```

### Kubernetes

```bash
# Apply manifests
kubectl apply -k k8s/overlays/development

# Check deployment
kubectl get pods -n ftc-app
kubectl logs -f <pod-name> -n ftc-app
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | HTTP server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `AWS_REGION` | AWS region | `us-east-1` |
| `EVENT_BUS_NAME` | EventBridge bus name | `fiap-tech-challenge-events-{env}` |
| `SQS_QUEUE_URL` | SQS queue URL for incoming events | - |

## Related Services

- [billing-service](../billing-service) - Budget & Payment Management
- [execution-service](../execution-service) - Production Management

## License

FIAP Tech Challenge - Phase 4
