import { Module } from '@nestjs/common';
import { ClaudeAiService } from './claude-ai.service';
import { ClaudeAiController } from './claude-ai.controller';
import { ClaudeAiNodeService } from './claude-ai.node';

@Module({
  providers: [ClaudeAiService, ClaudeAiNodeService],
  controllers: [ClaudeAiController],
  exports: [ClaudeAiService],
})
export class ClaudeAiModule {}
