import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../database/models/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
