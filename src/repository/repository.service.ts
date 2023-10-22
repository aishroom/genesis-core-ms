import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../share/config/config';
import { Socket } from 'socket.io';
import { Repository as TypeORMRepository } from 'typeorm';
import { Repository as RepositoryEntity } from '../database/models/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepositoryService {
  private connectedClients: Map<string, Socket> = new Map();

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    @InjectRepository(RepositoryEntity)
    private readonly repositoryRepository: TypeORMRepository<RepositoryEntity>,
  ) {}

  async createRepository(newRepository: RepositoryEntity) {
    const repository = await this.repositoryRepository.save(newRepository);
    if (!repository) {
      throw new Error('the repository could not be created');
    }
    return repository;
  }
}
