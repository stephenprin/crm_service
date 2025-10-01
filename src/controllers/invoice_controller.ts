import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice_service";
import { HttpStatus } from "../utils/constants/http_status";

export const InvoiceController = {
  async createInvoice(req: Request, res: Response) {
    try {
      const job_id = Number(req.params.id);
      const { lineItems } = req.body;

      const invoice = await InvoiceService.createInvoice(job_id, lineItems);

      res.status(HttpStatus.CREATED).json({ data: invoice });
    } catch (err: any) {
      if (err.code) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: { message: err.message, code: err.code } });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: {
          message: "Internal error",
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  },
};
