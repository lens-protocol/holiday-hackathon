import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { NodeEnvEnum } from './common/enum/config.enum';

// TODO: Add Email Config Validation
class EnvironmentVariables {
  @IsEnum(NodeEnvEnum)
  NODE_ENV: NodeEnvEnum;

  @IsPositive()
  PORT: number;

  @IsNotEmpty()
  @IsUrl({
    require_tld: false,
  })
  RPC_URL: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  SMART_CONTRACT_ADDR: string;

  @IsNotEmpty()
  @IsString()
  PRIVATE_KEY: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  REWARD_RELEASE_FROM_ADDR: string;
}

export function envValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
