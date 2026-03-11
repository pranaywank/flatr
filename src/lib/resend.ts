import { Resend } from 'resend';

// Initialize Resend with the API key or a dummy string for build-time evaluation
export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

// Use a shared testing domain or a verified sender email for development
export const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@flatr.fourg.dev';
