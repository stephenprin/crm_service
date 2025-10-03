export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  created_at?: Date;
}
