import { Body, Controller, Post } from '@nestjs/common';
import { ClaudeAiService } from './claude-ai.service';
import { ParseSocialVideoContextDto } from './dto/parse-social-video-context.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Claud AI')
@Controller({
  path: 'claude-ai',
  version: '1',
})
export class ClaudeAiController {
  constructor(private readonly aiService: ClaudeAiService) {}

  @Post('get-youtube-rating')
  async getRatingForYoutubeVideo(@Body() payload: ParseSocialVideoContextDto) {
    console.log('RECEIVED PAYOAD ::: ', {
      payload,
    });
    const resp = await this.aiService.parseContext(payload, true);
    return resp;
  }
}
