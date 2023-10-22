import { Module } from '@nestjs/common';
import { HclService } from './hcl.service';
@Module({
  providers: [HclService],
  exports: [HclService],
})
export class HclModule {}
