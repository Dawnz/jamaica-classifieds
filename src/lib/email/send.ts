import { resend, FROM_EMAIL, APP_NAME } from "./resend";
import {
  welcomeEmail,
  listingExpiryEmail,
  listingExpiredEmail,
  newListingConfirmEmail,
} from "./templates";

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    console.log("[email] attempting to send welcome to:", to);
    const result = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Welcome to Jamaica Classifieds, ${name}! 🇯🇲`,
      html: welcomeEmail(name),
    });
    console.log("[email] resend result:", JSON.stringify(result));
  } catch (err) {
    console.error("[email] welcome failed:", err);
  }
}

export async function sendListingConfirmEmail(
  to: string,
  name: string,
  listing: {
    id: string;
    title: string;
    priceLabel: string | null;
    parish: string;
    expiresAt: Date;
    tier: string;
  },
) {
  try {
    await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Your ad is live: "${listing.title}"`,
      html: newListingConfirmEmail(name, listing),
    });
  } catch (err) {
    console.error("[email] listing confirm failed:", err);
  }
}

export async function sendExpiryWarningEmail(
  to: string,
  name: string,
  listing: {
    id: string;
    title: string;
    priceLabel: string | null;
    parish: string;
    expiresAt: Date;
    tier: string;
  },
) {
  try {
    await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Your listing expires soon: "${listing.title}"`,
      html: listingExpiryEmail(name, listing),
    });
  } catch (err) {
    console.error("[email] expiry warning failed:", err);
  }
}

export async function sendExpiredEmail(
  to: string,
  name: string,
  listing: { id: string; title: string; parish: string },
) {
  try {
    await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Your listing has expired: "${listing.title}"`,
      html: listingExpiredEmail(name, listing),
    });
  } catch (err) {
    console.error("[email] expired failed:", err);
  }
}
