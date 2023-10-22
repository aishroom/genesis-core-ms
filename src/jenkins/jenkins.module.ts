import { Module } from '@nestjs/common';
import { JenkinsController } from './jenkins.controller';
import { JenkinsService } from './jenkins.service';

@Module({
  imports: [],
  exports: [JenkinsService],
  controllers: [JenkinsController],
  providers: [JenkinsService],
})
export class JenkinsModule {}
