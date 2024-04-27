import { Messages } from '@/shared/constants/messages.enum';
import { REGEX_PATTERN } from '@/shared/constants/regex-pattern.constant';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class SignUpDTO {
  @IsString({ message: 'username must be of type string' })
  @IsNotEmpty({ message: Messages.USERNAME_EMPTY })
  @Length(3, 30, {
    message: Messages.USERNAME_LENGTH,
  })
  @Matches(REGEX_PATTERN.username, {
    message: Messages.USERNAME_PATTERN,
  })
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255, { message: 'password must contain from 8 to 255 characters' })
  password: string;
}
