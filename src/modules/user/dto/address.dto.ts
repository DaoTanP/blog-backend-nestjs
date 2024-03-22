import { GeoDTO } from './geo.dto';

export class AddressDTO {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
  geo?: GeoDTO;
}
