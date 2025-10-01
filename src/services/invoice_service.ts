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

    if (job.status !== JOB_STATUS.COMPLETED) {
      const error: any = new Error("Job must be COMPLETED before invoicing");
      error.errorType = ErrorType.JOB_NOT_DONE;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }

    const invoice = await InvoiceModel.createInvoice(job_id, lineItems);

    await JobModel.updateJobStatus(job_id, JOB_STATUS.INVOICED);

    return invoice;
  },
};
