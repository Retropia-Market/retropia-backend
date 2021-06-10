import { RowDataPacket } from 'mysql2';

export type bidResponse = {
  id: number;
  product_id: number;
  bid_price: number;
  edited_bid_price: number;
  user_id: number;
  edited_bid_message: string;
  bid_status: string;
  bid_date: string;
};
