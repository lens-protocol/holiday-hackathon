import { BadRequestException, Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeAiNodeService {
  private anthropicClient: Anthropic;
  constructor() {
    this.initClient();
  }

  private async initClient() {
    this.anthropicClient = new Anthropic({
      apiKey:
        '',
    });
  }

  private async getClient() {
    if (!this.anthropicClient) {
      await this.initClient();
    }

    return this.anthropicClient;
  }

  private async getPromptResultFromContent(content: string) {
    let returnVal: Anthropic.Messages.ContentBlock[] | undefined = undefined;

    try {
      const msg = await this.anthropicClient.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
        model: 'claude-3-opus-20240229',
      });
      returnVal = msg.content.filter((item) => item.type === 'text');
    } catch (err) {
      console.log('Error while parsing the rating for the provided content !', err);
    }

    return returnVal;
  }

  private parseRatingFromPromptResult(promptResults: Anthropic.Messages.ContentBlock[]) {
    let parsedRating: number | undefined = undefined;

    const promptResult = promptResults.filter((item) => item.type === 'text');
    if (!promptResult.length) {
      throw new BadRequestException('No prompt result received to parse !');
    }

    const matchResult = promptResult[0].text.match(/Rating: (\d+)/);
    if (matchResult && matchResult.length) {
      parsedRating = Number(matchResult[1]);
    }

    return parsedRating;
  }

  async getRatingFromContent(content: string) {
    await this.getClient();
    const promptResult = await this.getPromptResultFromContent(content);
    if (!promptResult) {
      throw new BadRequestException('Unable to parse prompt result for the given content !');
    }

    const parsedRating = await this.parseRatingFromPromptResult(promptResult);
    return parsedRating;
  }
}
