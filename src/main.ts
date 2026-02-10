import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Enable CORS
  app.enableCors()

  // API prefix
  const apiPrefix = process.env.API_PREFIX || '/api/v1'
  app.setGlobalPrefix(apiPrefix)

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('OS Service API')
    .setDescription('Service Order Management Microservice - FIAP Tech Challenge Phase 4')
    .setVersion('1.0')
    .addTag('service-orders', 'Service order management endpoints')
    .addTag('clients', 'Client management endpoints')
    .addTag('vehicles', 'Vehicle management endpoints')
    .addTag('appointments', 'Appointment scheduling endpoints')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)

  console.log(`🚀 OS Service is running on: http://localhost:${port}${apiPrefix}`)
  console.log(`📚 Swagger docs available at: http://localhost:${port}${apiPrefix}/docs`)
}

bootstrap()
