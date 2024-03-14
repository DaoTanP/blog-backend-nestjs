import { IsNotEmpty, Length } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @Length(1)
  usernameOrEmail: string;

  @IsNotEmpty()
  @Length(1)
  password: string;
}
