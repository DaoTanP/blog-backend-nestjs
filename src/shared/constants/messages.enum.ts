// eslint-disable-next-line no-shadow
export enum Messages {
  USER_NOT_FOUND = 'user not found',
  USERNAME_EMPTY = 'username must not be empty',
  USERNAME_PATTERN = 'username can only contain letters, numbers, "-", and "_"',
  USERNAME_EXIST = 'username already exists',
  USERNAME_LENGTH = 'username must contain from 3 to 30 characters',
  EMAIL_EMPTY = 'email must not be empty',
  EMAIL_INVALID = 'Invalid email address',
  POST_NOT_FOUND = 'Post not found',
  EMAIL_EXIST = 'Email already exists',
  COMMENT_NOT_FOUND = 'Comment not found',
  INTERNAL_SERVER_ERROR = 'An error occurred while processing your request',
  UPDATE_USER = 'Update user profile successfully!',
  GIVE_ADMIN = 'Admin role has been assigned.',
  TASK_ADMIN = 'Admin role has been revoked.',
  USERROLE_NOT_FOUND = 'user role not found.',
  USER_IS_ADMIN = 'user is admin.',
  USER_NOT_ADMIN = 'user not admin.',
  TODO_NOT_FOUND = 'Todo not found',
  ALBUM_NOT_FOUND = 'Album not found',
  PHOTO_NOT_FOUND = 'Photo not found',
}
