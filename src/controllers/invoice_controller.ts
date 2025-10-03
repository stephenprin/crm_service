import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice_service";
import { HttpStatus } from "../utils/constants/http_status";

export const InvoiceController = {
  async createInvoice(req: Request, res: Response) {

    try {
      const job_id = Number(req.params.job_id);
      const { lineItems } = req.body;


      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: { message: "Line items must be a non-empty array", code: 400 },
        });
      }

      const invoice = await InvoiceService.createInvoice(job_id, lineItems);

      return res.status(HttpStatus.CREATED).json({ data: invoice });
    } catch (err: any) {
      if (err.code) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: { message: err.message, code: err.code } });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: {
          message: "Internal error",
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  },
};
