import { BadRequestException, Injectable } from '@nestjs/common';
import { ParseSocialVideoContextDto } from './dto/parse-social-video-context.dto';
import { CladueAILanguage } from './enums';
import { getSubtitles } from 'youtube-captions-scraper';
import { ClaudeAiNodeService } from './claude-ai.node';

function randomIntFromPreferredRange(min, max) {
  // Generate a random value and then apply a power to create a bias towards lower values
  const range = max - min + 1;
  const randomValue = Math.random() ** 2; // Squaring to give more weight to lower numbers
  return Math.floor(randomValue * range) + min;
}

@Injectable()
export class ClaudeAiService {
  constructor(private readonly aiNodeService: ClaudeAiNodeService) {}

  async parseContext(payload: ParseSocialVideoContextDto, skipAI = false): Promise<number> {
    if (skipAI) {
      return await new Promise((resolve) => {
        setTimeout(() => {
          const randomNumber = randomIntFromPreferredRange(2, 5);
          resolve(randomNumber);
        }, 3000);
      });
    }
    const { videoId, brand } = payload;

    const captions = await this.getVideoCaptions({
      videoId,
      lang: CladueAILanguage.English,
    });

    if (!captions) {
      throw new BadRequestException('Captions not found for the provided video !');
    }

    const contextFromCaptions = await this.getContextFromCaptions({
      captions,
      searchStrings: [brand],
    });
    const generatedPrompt = this.preparePromptFromCaptionContext(
      `${brand}: \n ${contextFromCaptions.length ? contextFromCaptions.join('\n') : ''}`,
    );

    const ratings = await this.aiNodeService.getRatingFromContent(generatedPrompt);
    return ratings;
  }

  private preparePromptFromCaptionContext(promptExtraStr?: string) {
    return `can you tell on the scale of 5 how the person in this text is rating product named ${promptExtraStr} I just want rating on the scale of 10 from you. The result should be only this -> Rating: {Rating}`;
  }

  /**
   * This method will check the video and fetch the captions from the video
   */
  private async getVideoCaptions({
    videoId,
    lang,
  }: {
    videoId: string;
    lang?: CladueAILanguage;
  }): Promise<string> {
    const contentLang = lang !== CladueAILanguage.Other ? CladueAILanguage.English : lang;
    console.log('FETCHING VIDEO PARSER ::: ', {
      videoId,
      lang,
      contentLang,
    });
    const captionItems: { start: string; text: string }[] | undefined = await getSubtitles({
      videoID: videoId,
      // lang: contentLang,
    });

    console.log('Generated Captions ::: ', {
      captionItems,
    });
    return captionItems.map((item) => item.text).join('\n');
  }

  private async getContextFromCaptions({
    captions,
    searchStrings,
    linesToLookAroundContext = 12,
  }: {
    captions: string;
    searchStrings: string[];
    linesToLookAroundContext?: number;
  }) {
    const contextLines: string[] = [];
    const captionLines = captions.split('\n');
    if (!captionLines.length) {
      throw new BadRequestException('No captions found to generate context from !');
    }

    const normalizedSearchLines = new Set<string>();
    if (searchStrings) {
      searchStrings.map((searchStr) => normalizedSearchLines.add(searchStr.toLowerCase()));
    }

    if (!normalizedSearchLines.size) {
      throw new BadRequestException('No search string for context to search through !');
    }

    for (let index = 0; index < captionLines.length; index++) {
      const currentLine = captionLines[index].toLowerCase();

      if ([...normalizedSearchLines].some((searchString) => currentLine.includes(searchString))) {
        const startLine = Math.max(0, index - linesToLookAroundContext);
        const endLine = Math.min(captionLines.length - 1, index + linesToLookAroundContext);
        const contextMatchedLines = captionLines.slice(startLine, endLine + 1);
        if (contextMatchedLines.length) contextLines.concat(contextMatchedLines);
      }
    }
    return contextLines;
  }
}
