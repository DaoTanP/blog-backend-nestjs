import { IsNotEmpty, Length } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @Length(1, 255)
  usernameOrEmail: string;

  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
