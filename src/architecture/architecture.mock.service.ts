import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RequestCreateArchitecture } from './dto/RequestCreateArchitecture.dto';
import config from '../share/config/config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ArchitectureRef } from '../database/models/architectureRef.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/database/models/link.entity';

@Injectable()
export class ArchitectureMockService {
  constructor(
    @InjectRepository(ArchitectureRef)
    private readonly architectureRefRepository: Repository<ArchitectureRef>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
  ) {}

  findAll(): any {
    try {
      const services = [];
      return services;
    } catch (error) {
      const eMsg = `'Consumer fail to github all service' Message: ${error.message}`;
      throw new HttpException(
        {
          Code: error.response.status,
          Description: eMsg,
        },
        error.response.status,
      );
    }
  }

  create() {
    //TO-DO
    throw new HttpException(
      'we are working on this, you cloud use the mock service...',
      HttpStatus.NOT_FOUND,
    );
  }

  async findById(id: number): Promise<ArchitectureRef> {
    const architectureRef = await this.architectureRefRepository
      .createQueryBuilder('architectureRef')
      .leftJoinAndSelect('architectureRef.firstLink', 'link')
      .where('architectureRef.id = :id', { id })
      .getOne();

    if (!architectureRef) {
      throw new HttpException(
        `Architecture by id: ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    return architectureRef;
  }

  async createArchitecture(
    architectureRequestDto: RequestCreateArchitecture,
    client: Socket,
  ): Promise<any> {
    try {
      const clientsIdJson = JSON.stringify([client.id]);
      architectureRequestDto.name = architectureRequestDto.name.replace(
        ' ',
        '%20',
      );

      const architectureRef: ArchitectureRef = await this.findById(
        architectureRequestDto.idArchitectureRef,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  getRepoName(teamSlug, name, postFix): string {
    return `${teamSlug}-${name}-${postFix}`;
  }

  async executeLink(idObservable: string, link: Link): Promise<any> {
    try {
      const { nextLink, ...linkEmit } = link;
      const linkJson =
        JSON.stringify(linkEmit).length <= 2000
          ? JSON.stringify(linkEmit).replace(' ', '%20')
          : '{}';

      const jobRoute = linkEmit.job || 'create-repo/';
      const jenkinsUrl =
        `${this.configService.JENKINSENDPOINT}${jobRoute}/buildWithParameters` +
        `?id_observable=${idObservable}` +
        `&link=${linkJson}` +
        `&url_genesis=${this.configService.URL_GENESIS}`;
      const res = await axios({
        method: 'POST',
        url: jenkinsUrl,
        auth: {
          username: this.configService.USERJENKINS,
          password: this.configService.TOKENJENKIN,
        },
      });
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
}
