import { IsNotEmpty, Length } from 'class-validator';
import { AddressDTO } from './address.dto';
import { CompanyDTO } from './company.dto';

export class UserDTO {
  firstName: string;
  lastName: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @Length(8)
  password: string;
  @IsNotEmpty()
  email: string;
  address: AddressDTO;
  phone: string;
  website: string;
  company: CompanyDTO;
}
