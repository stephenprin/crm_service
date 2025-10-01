import { Request, Response } from "express";
import { CustomerService } from "../services/customer_service";
import { ErrorCode } from "../constants/error_code";

export const CustomerController = {
  async createCustomer(req: Request, res: Response) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json({ data: customer });
    } catch (err: any) {
      res.status(400).json({
        error: {
          message: err.message || "Invalid request",
          code: err.code || ErrorCode.INTERNAL_ERROR,
        },
      });
    }
  },

  async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await CustomerService.getCustomerById(
        Number(req.params.id)
      );
      if (!customer) {
        return res.status(404).json({
          error: {
            message: "Customer not found",
            code: ErrorCode.CUSTOMER_NOT_FOUND,
          },
        });
      }
      res.status(200).json({ data: customer });
    } catch (err: any) {
      res.status(500).json({
        error: {
          message: "Unexpected error occurred",
          code: ErrorCode.INTERNAL_ERROR,
        },
      });
    }
  },
};
