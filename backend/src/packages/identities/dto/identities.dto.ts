import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class identitiesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUrl({ require_tld: false })
    link: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEthereumAddress()
    address: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string
}
