import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Get config service
  const configService = app.get(ConfigService)

  // Enable CORS for frontend
  app.enableCors({
    origin: configService.get("FRONTEND_URL"),
    credentials: true,
  })

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Set global prefix
  app.setGlobalPrefix("api")

  const port = configService.get("PORT") || 3001
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap()
