import { Regex } from '@/shared/constants/regex.constant';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class SignUpDTO {
  @IsString({ message: 'username must be of type string' })
  @IsNotEmpty({ message: 'username must not be empty' })
  @Length(3, 30, {
    message: 'username must contain from 3 to 30 characters',
  })
  @Matches(Regex.username, {
    message: 'username can only contain letters, numbers, "-", and "_"',
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
