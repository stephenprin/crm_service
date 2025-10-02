import { InvoiceModel } from "../models/invoice_model";
import { PaymentModel } from "../models/payment_model";
import { JobModel } from "../models/job_model";
import { ErrorType } from "../utils/constants/error_type";
import { HttpStatus } from "../utils/constants/http_status";
import { JOB_STATUS } from "../utils/constants/job_status";
import { INVOICE_STATUS } from "../utils/constants/invoice";

export class PaymentService {
  static async recordPayment(invoice_id: number, amount: number) {
    const invoice = await InvoiceModel.findInvoiceById(invoice_id);
    if (!invoice) {
      const error: any = new Error("Invoice not found");
      error.code = HttpStatus.NOT_FOUND;
      return error;
    }

    if (amount <= 0) {
      const error: any = new Error("Invalid payment amount");
      error.type = ErrorType.INVALID_PAYMENT;
      return error;
    }

    if (amount > Number(invoice.total_amount)) {
      const error: any = new Error("Payment cannot exceed remaining balance");
      error.type = ErrorType.INVALID_PAYMENT;
      error.code = HttpStatus.BAD_REQUEST;
      return error;
    }

    const payment = await PaymentModel.recordPayment({
      invoice_id,
      amount,
    });

    const newPaidAmount = Number(invoice.paid_amount) + amount;
    const newRemainingBalance = Number(invoice.total_amount) - newPaidAmount;

    let newStatus = invoice.status;
    if (newRemainingBalance === 0) {
      newStatus = INVOICE_STATUS.PAID;
      await JobModel.updateJobStatus(invoice.job_id, JOB_STATUS.PAID);
    }

    const updatedInvoice = await InvoiceModel.updateBalances(
      invoice_id,
      newPaidAmount,
      newRemainingBalance,
      newStatus
    );

    return {
      message: "Payment recorded successfully",
      payment,
      invoice: updatedInvoice,
    };
  }
}
