import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        // CAMBIA AQUÍ el origen para que coincida con la dirección actual del frontend
        origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5174',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const port = process.env.BACKEND_PORT || 3000;

    await app.listen(port);
    console.log(`\n🚀 Servidor NestJS escuchando en http://localhost:${port}`);
}

bootstrap();