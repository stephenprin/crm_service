import pool from "../config/db";
import { Customer } from "../interfaces/customer";

export const CustomerModel = {
  async createCustomer(customer: Customer): Promise<Customer> {
    const { name, phone, email, address } = customer;
  
    const result = await pool.query(
      "INSERT INTO customers (name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, email, address]
    );
    return result.rows[0];
  },

  async findCustomerById(id: number): Promise<Customer | null> {
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },

  async findByEmail(email: string): Promise<Customer | null> {
    const query = `
      SELECT id, name, email, phone, address, created_at
      FROM customers
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  },
};
