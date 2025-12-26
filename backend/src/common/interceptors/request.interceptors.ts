import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const BodyAndParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return { ...req.body, ...req.params };
  },
);
