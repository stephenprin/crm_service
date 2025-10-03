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

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      const error: any = new Error("Invalid payment amount");
      error.type = ErrorType.INVALID_PAYMENT;
      throw error;
    }

    if (amount > Number(invoice.total_amount)) {
      const error: any = new Error("Payment cannot exceed remaining balance");
      error.type = ErrorType.INVALID_PAYMENT;
      error.code = HttpStatus.BAD_REQUEST;
      throw error;
    }

    const payment = await PaymentModel.recordPayment({
      invoice_id,
      amount,
    });


   const amt = Number(amount);
if (!Number.isFinite(amt) || amt <= 0) {
  throw new Error("Invalid payment amount.");
}

if (
  invoice.total_amount === undefined ||
  invoice.paid_amount === undefined
) {
  throw new Error("Invoice total amount or paid amount is undefined.");
}

 let newStatus= invoice.status;
const remainingBefore = Number(invoice.total_amount) - Number(invoice.paid_amount);

if (amt > remainingBefore) {
  throw new Error("Payment amount exceeds remaining balance.");
}
    const newPaidAmount = Number((Number(invoice.paid_amount) + amt).toFixed(2));
const newRemainingBalance = Number((Number(invoice.total_amount) - newPaidAmount).toFixed(2));
const safeRemainingBalance = newRemainingBalance < 0 ? 0 : newRemainingBalance;

    if (safeRemainingBalance === 0) {
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
