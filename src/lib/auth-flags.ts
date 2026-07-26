/** Safe to import from any page — no Prisma side effects. */
export const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID?.trim()) &&
  Boolean(process.env.AUTH_GOOGLE_SECRET?.trim());
