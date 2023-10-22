import { AppController } from './share/domain/app.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './share/config/config';
import { ArchitectureModule } from './architecture/architecture.module';
import { ElementModule } from './element/element.module';
import { JenkinsModule } from './jenkins/jenkins.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProductModule } from './product/product.module';
import { ProjectTypeModule } from './project-type/project-type.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { RepositoryModule } from './repository/repository.module';
import { APP_FILTER } from '@nestjs/core';
import { AuthorizationExceptionFilter } from './filters/authorization-exception.filter';
import { LinkModule } from './link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    HttpModule,
    ArchitectureModule,
    ElementModule,
    JenkinsModule,
    TypeOrmModule,
    DatabaseModule.forRoot(),
    WorkspaceModule,
    ProductModule,
    ProjectTypeModule,
    RepositoryModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: AuthorizationExceptionFilter,
    },
  ],
})
export class AppModule {}
