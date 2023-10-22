import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { DatabaseModule } from '../src/database/database.module';

@Module({
  imports: [AppModule, DatabaseModule, HttpModule, ConfigModule],
})
export class RootTestModule {}
