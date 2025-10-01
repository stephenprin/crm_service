import { CustomerModel } from "../models/customer_model";
import { Customer } from "../interfaces/customer";
import { ErrorType } from "../utils/constants/error_type";
import { HttpStatus } from "../utils/constants/http_status";

export const CustomerService = {
  async createCustomer(data: Customer): Promise<Customer> {
    const existing = await CustomerModel.findByEmail(data.email);
    if (existing) {
      const error: any = new Error("A customer with this email already exists");
      error.type = ErrorType.DUPLICATE_ENTRY;
      error.code = HttpStatus.CONFLICT;
      return error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      const error: any = new Error("Invalid email format");
      error.type = ErrorType.INVALID_EMAIL_FORMAT;
      error.code = HttpStatus.BAD_REQUEST;
      return error;
    }

    const created = await CustomerModel.createCustomer(data);
    return {
      ...created,
      email: created.email.toLowerCase(),
    };
  },

  async getCustomerById(id: number): Promise<Customer | null> {
    return await CustomerModel.findCustomerById(id);
  },
};
