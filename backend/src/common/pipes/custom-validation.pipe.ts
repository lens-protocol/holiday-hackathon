import { ValidationPipe, ArgumentMetadata, Injectable } from '@nestjs/common';
import { REWRITE_VALIDATION_OPTIONS } from '../constants/decordator.constant';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    const options = Reflect.getMetadata(REWRITE_VALIDATION_OPTIONS, metadata.metatype);
    if (options && this.validatorOptions) {
      Object.assign(this.validatorOptions, options);
    } else if (options && !this.validatorOptions) {
      this.validatorOptions = options;
    }
    return super.transform(value, metadata);
  }
}
