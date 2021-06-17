export interface UserEntity {
  id: number;
  username: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  location: string;
  bio: string;
  image: string;
  phone_number: string;
  brith_date: string;
  status: number;
  email_code?: string;
  external_user: number;
}
