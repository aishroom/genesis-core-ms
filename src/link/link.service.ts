import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '../database/models/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async getLinkChainbyId(id: number): Promise<Link> {
    const link = await this.linkRepository
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.nextLink', 'nextLink')
      .leftJoinAndSelect('link.varFiles', 'varFile')
      .leftJoinAndSelect('varFile.variables', 'variable')
      .leftJoinAndSelect('link.linkProjectTypes', 'linkProjectTypes')
      .leftJoinAndSelect('linkProjectTypes.projectType', 'projectType')
      .where('link.id = :id', { id })
      .getOne();

    if (link && link.nextLink) {
      link.nextLink = await this.getLinkChainbyId(link.nextLink.id);
    }

    return link;
  }
}
