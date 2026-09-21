import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TaGbL5GVmCziYF',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'BtnHTwgqcE7aItb7wfysX8X8',
});

/**
 * Create a payment order for company placement invoice
 */
export async function createInvoicePaymentOrder(
  invoiceId: string,
  amountInr: number,
  currency: string = 'INR'
): Promise<any> {
  const options = {
    amount: Math.round(amountInr * 100), // Razorpay expects amount in paise
    currency,
    receipt: `rcpt_${invoiceId.slice(0, 20)}`,
    notes: {
      invoiceId,
      platform: 'THAMILARASAN GLOBAL',
    },
  };

  return razorpay.orders.create(options);
}
