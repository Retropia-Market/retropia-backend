import { Request } from 'express';
import { UserEntity } from './db-entities';

export interface CustomReq extends Request {
  user: UserEntity;
  passwordToken?: string;
}
