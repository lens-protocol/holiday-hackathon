import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParseSocialVideoContextDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  videoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brand: string;
}
