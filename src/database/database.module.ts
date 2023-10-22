import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from './models/repository.entity';
import { Product } from './models/product.entity';
import { ArchitectureRef } from './models/architectureRef.entity';
import { Workspace } from './models/workspace.entity';
import { ProductWorkspace } from './models/productWorkspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './models/projectType.entity';
import { Link } from './models/link.entity';
import { VarFile } from './models/varFile.entity';
import { Variable } from './models/variable.entity';
import { LinkProjectType } from './models/linkProjectType.entity';
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const dbConfigService =
              configService.get<any>('configuration').DB_CONFIG;
            const config = {
              type: dbConfigService.TYPE,
              host: dbConfigService.HOST,
              port: dbConfigService.PORT,
              username: dbConfigService.USERNAME,
              password: dbConfigService.PASSWORD,
              database: dbConfigService.DATABASE,
            };
            return {
              ...config,
              entities: [
                Repository,
                Product,
                ArchitectureRef,
                Workspace,
                ProductWorkspace,
                ProjectType,
                Link,
                VarFile,
                Variable,
                LinkProjectType,
              ],
              synchronize: true,
              autoLoadEntities: true,
            };
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
