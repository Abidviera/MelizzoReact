import type { WhatsAppProduct } from '../types';

const WHATSAPP_NUMBER = '+17059270127';
const BASE_URL = 'https://api.whatsapp.com/send';

function buildProductMessage(product: WhatsAppProduct): string {
  let msg = `Hi! I'm interested in ordering:\n\n*${product.name}*`;
  if (product.description) msg += `\n${product.description}`;
  if (product.price) msg += `\nPrice: ${product.price}`;
  if (product.quantity) msg += `\nQuantity: ${product.quantity}`;
  if (product.image) msg += `\n\nImage: ${product.image}`;
  msg += '\n\nPlease confirm availability and total.';
  return encodeURIComponent(msg);
}

function buildCartMessage(items: WhatsAppProduct[], total: number): string {
  let msg = `Hi! I'd like to place an order for:\n\n`;
  items.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.name}*`;
    if (item.quantity) msg += ` x${item.quantity}`;
    if (item.price) msg += ` — ${item.price}`;
    msg += '\n';
  });
  msg += `\n*Total: ${total}*\n\nPlease confirm availability.`;
  return encodeURIComponent(msg);
}

function buildOrderMessage(orderNumber: string): string {
  const msg = `Hi! I've just placed order *${orderNumber}* on the MELiZZO website. Please confirm收到了. (I just placed order ${orderNumber} on the MELiZZO website. Please confirm receipt.)`;
  return encodeURIComponent(msg);
}

export const WhatsAppService = {
  sendProductInquiry(product: WhatsAppProduct) {
    const url = `${BASE_URL}?phone=${WHATSAPP_NUMBER.replace(/[\s+]/g, '')}&text=${buildProductMessage(product)}`;
    window.open(url, '_blank');
  },

  sendCartOrder(items: WhatsAppProduct[], total: number) {
    const url = `${BASE_URL}?phone=${WHATSAPP_NUMBER.replace(/[\s+]/g, '')}&text=${buildCartMessage(items, total)}`;
    window.open(url, '_blank');
  },

  sendOrderConfirmation(orderNumber: string) {
    const url = `${BASE_URL}?phone=${WHATSAPP_NUMBER.replace(/[\s+]/g, '')}&text=${buildOrderMessage(orderNumber)}`;
    window.open(url, '_blank');
  },

  sendCustomMessage(message: string) {
    const url = `${BASE_URL}?phone=${WHATSAPP_NUMBER.replace(/[\s+]/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  sendGeneralInquiry() {
    const msg = encodeURIComponent(
      'Hi! I have a question about MELiZZO products. Can you help?'
    );
    const url = `${BASE_URL}?phone=${WHATSAPP_NUMBER.replace(/[\s+]/g, '')}&text=${msg}`;
    window.open(url, '_blank');
  },
};
