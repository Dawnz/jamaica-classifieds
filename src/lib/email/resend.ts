import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "noreply@jamaicaclassifieds.com";
export const APP_NAME = "Jamaica Classifieds";
export const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
