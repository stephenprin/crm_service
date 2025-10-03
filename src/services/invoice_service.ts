import { InvoiceModel } from "../models/invoice_model";
import { JobModel } from "../models/job_model";
import { JOB_STATUS } from "../utils/constants/job_status";
import { ErrorType } from "../utils/constants/error_type";
import { Invoice, InvoiceLineItem } from "../interfaces/invoice";
import { HttpStatus } from "../utils/constants/http_status";

export const InvoiceService = {
  async createInvoice(
    job_id: number,
    lineItems: InvoiceLineItem[]
  ): Promise<Invoice> {
    const job = await JobModel.findJobById(job_id);
    if (!job) {
      const error: any = new Error("Job not found");
      error.error = ErrorType.JOB_NOT_FOUND;
      error.code = HttpStatus.NOT_FOUND;
      throw error;
    }

    if (job.job.status !== JOB_STATUS.COMPLETED) {
      const error: any = new Error("Job must be COMPLETED before invoicing");
      error.errorType = ErrorType.JOB_NOT_DONE;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }

    const taxRate = 0.1;
    const subtotal = lineItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      return sum + quantity * price;
    }, 0);

    const tax = subtotal * taxRate;
    const total_amount = subtotal + tax;

    const invoice = await InvoiceModel.createInvoice(
      job_id,
      lineItems,
      subtotal,
      tax,
      total_amount
    );

    await JobModel.updateJobStatus(job_id, JOB_STATUS.INVOICED);

    return invoice;
  },
};
