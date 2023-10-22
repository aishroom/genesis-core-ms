import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElementController } from './element.controller';
import { ElementMockService } from './element.mock.service';
import { ElementService } from './element.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ElementService',
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        if (
          env === 'local' ||
          env === 'develop' ||
          env === 'development' ||
          env === 'production'
        ) {
          return new ElementMockService();
        }
        return new ElementService();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['ElementService'],
  controllers: [ElementController],
})
export class ElementModule {}
