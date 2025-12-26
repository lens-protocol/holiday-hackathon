import { SetMetadata } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { REWRITE_VALIDATION_OPTIONS } from '../constants/decordator.constant';

export function RewriteValidationOptions(options: ValidatorOptions) {
  return SetMetadata(REWRITE_VALIDATION_OPTIONS, options);
}
