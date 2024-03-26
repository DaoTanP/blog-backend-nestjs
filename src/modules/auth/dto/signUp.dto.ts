import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  website: string;
}
