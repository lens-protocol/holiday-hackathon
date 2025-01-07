import { createHash } from 'crypto';

export function getHashSHA1(data) {
  return createHash('sha1')
    .update(data)
    .digest('hex');
}
