export const PostErrorCode = {
  NOT_FOUND: 'post/not-found',
  CREATE_FAILED: 'post/create-failed',
  UPDATE_FAILED: 'post/update-failed',
  DELETE_FAILED: 'post/delete-failed',
  VALIDATION_FAILED: 'post/validation-failed',
} as const;

type PostErrorCode = (typeof PostErrorCode)[keyof typeof PostErrorCode];

export const ERROR_DEFINITIONS = {
  [PostErrorCode.NOT_FOUND]: {
    message: 'Post not found',
    statusCode: 404,
  },
  [PostErrorCode.CREATE_FAILED]: {
    message: 'Failed to create post',
    statusCode: 500,
  },
  [PostErrorCode.UPDATE_FAILED]: {
    message: 'Failed to update post',
    statusCode: 500,
  },
  [PostErrorCode.DELETE_FAILED]: {
    message: 'Failed to delete post',
    statusCode: 500,
  },
  [PostErrorCode.VALIDATION_FAILED]: {
    message: 'Post validation failed',
    statusCode: 400,
  },
} as const;
