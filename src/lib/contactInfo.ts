/**
 * Centralized contact details and WhatsApp URL helpers.
 */

export const CONTACT_PHONE = "+27 79 448 6843";
export const CONTACT_PHONE_DISPLAY = "079 448 6843";
export const CONTACT_PHONE_RAW = "27794486843";
export const CONTACT_EMAIL = "spaceheadai@gmail.com";

/**
 * Returns a wa.me direct chat link with pre-filled message text.
 */
export function whatsappLinkWithMessage(message: string): string {
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${CONTACT_PHONE_RAW}?text=${encoded}`;
}
