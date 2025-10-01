import { CustomerModel } from "../models/customer_model";
import { Customer } from "../interfaces/customer";
import { ErrorCode } from "../constants/error_code";

export const CustomerService = {
  async createCustomer(data: Customer): Promise<Customer> {
    if (!data.email.includes("@")) {
      const error: any = new Error("Invalid email format");
      error.code = ErrorCode.INVALID_EMAIL_FORMAT;
      throw error;
    }
    return await CustomerModel.createCustomer(data);
  },

  async getCustomerById(id: number): Promise<Customer | null> {
    return await CustomerModel.findCustomerById(id);
  },
};
