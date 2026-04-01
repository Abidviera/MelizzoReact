import type { PaymentDetails } from '../types';

interface PaymentRequest {
  amount: number;
  currency?: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

const useMockPayment = true;

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function getCardType(number: string): string {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^6(?:011|5)/.test(n)) return 'discover';
  return 'unknown';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expDate = new Date(year, month);
  return expDate > now;
}

export const PaymentService = {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (useMockPayment) {
      return this.processMockPayment(request);
    }
    return this.processStripePayment(request);
  },

  async processMockPayment(request: PaymentRequest): Promise<PaymentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const validation = this.validatePaymentRequest(request);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'Validation failed' };
    }

    const random = Math.random();
    if (random < 0.95) {
      return {
        success: true,
        transactionId: `mock_txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        message: 'Payment processed successfully',
      };
    }
    return { success: false, message: 'Payment declined. Please try again.' };
  },

  async processStripePayment(_request: PaymentRequest): Promise<PaymentResponse> {
    console.warn('[PaymentService] Stripe integration not configured — using mock');
    return {
      success: false,
      message: 'Stripe integration not yet configured. Please use mock payment.',
    };
  },

  validatePaymentRequest(request: PaymentRequest): { valid: boolean; error?: string } {
    const { cardNumber, expiryDate, cvv, email } = request;

    if (!luhnCheck(cardNumber)) {
      return { valid: false, error: 'Invalid card number' };
    }

    if (!validateExpiry(expiryDate)) {
      return { valid: false, error: 'Card has expired or invalid expiry date' };
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return { valid: false, error: 'Invalid CVV' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { valid: false, error: 'Invalid email address' };
    }

    return { valid: true };
  },

  getCardType,
  formatCardNumber,
  formatExpiryDate,
};
