import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from '../database/models/workspace.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async save(workspace: Workspace): Promise<Workspace> {
    const savedWorkspace = await this.workspaceRepository.save(workspace);
    if (!savedWorkspace) {
      throw new HttpException(
        `Workspace ${workspace.id}, the entity could not be saved. The provided data is invalid or incomplete.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return savedWorkspace;
  }
  async findAllBasicInfo(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  async findAllEcosystemBasicInfo(): Promise<Workspace[]> {
    return this.workspaceRepository.find({ where: { isEcosystem: true } });
  }

  async findAllCompleteInfo(): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      relations: [
        'awsAccount',
        'productWorkspaces.product',
        'productWorkspaces.product.repositories',
      ],
    });
  }

  async findLikeNameCompleteInfo(name: string): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      relations: [
        'awsAccount',
        'productWorkspaces.product',
        'productWorkspaces.product.repositories',
      ],
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  // agregamos metodo para obtener un workspace por nombre utilizando finOne
  async findOneLikeNameCompleteInfo(name: string): Promise<Workspace | null> {
    const result = await this.workspaceRepository.findOne({
      relations: [
        'awsAccount',
        'productWorkspaces.product',
        'productWorkspaces.product.repositories',
      ],
      where: {
        name: Like(`%${name}%`),
      },
    });
    return result || null;
  }

  async findByIdBasicInfo(id: number): Promise<Workspace> {
    return this.workspaceRepository.findOneBy({ id: id });
  }

  async findAllEcosystemCompleteInfo(): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      relations: [
        'awsAccount',
        'productWorkspaces.product',
        'productWorkspaces.product.repositories',
      ],
      where: {
        isEcosystem: true,
      },
    });
  }

  async findByIdCompleteInfo(id: number): Promise<Workspace> {
    return this.workspaceRepository.findOne({
      relations: [
        'awsAccount',
        'productWorkspaces.product',
        'productWorkspaces.product.repositories',
      ],
      where: {
        id: id,
      },
    });
  }
}
