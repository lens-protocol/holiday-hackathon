import { Module } from '@nestjs/common';
import { IdentitiesController } from './identities.controller';
import { IdentitiesService } from './identities.service';
import { ClaudeAiModule } from '../claude-ai/claude-ai.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  controllers: [IdentitiesController],
  providers: [IdentitiesService],
  imports: [ClaudeAiModule, QueuesModule],
})
export class IdentitiesModule {}
