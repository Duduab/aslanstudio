/**
 * Map Google / env failures to HTTP responses for API routes.
 */

export function resolveGoogleCalendarRouteError(
  e: unknown,
  opts: { localEnvHint: string; vercelEnvHint: string },
): { status: number; error: string; details?: string } {
  const raw = e instanceof Error ? e.message : String(e);
  const devDetails = process.env.NODE_ENV === "development" ? raw : undefined;

  if (raw.includes("Missing required environment")) {
    const hint = process.env.VERCEL === "1" ? opts.vercelEnvHint : opts.localEnvHint;
    return {
      status: 503,
      error: `שילוב Google Calendar לא הוגדר בשרת. ${hint}`,
      details: devDetails,
    };
  }

  // Token / OAuth client mismatch (common after rotating secret or wrong client id).
  if (
    /unauthorized_client|invalid_client|invalid_grant|access_denied/i.test(raw)
  ) {
    const isUnauthorizedClient = /unauthorized_client/i.test(raw);
    const scriptHint =
      process.env.VERCEL === "1"
        ? ""
        : " בפיתוח מקומי הריצו: npm run google:refresh-token (אותו OAuth Client כמו ב־.env.local).";
    const hint =
      process.env.VERCEL === "1"
        ? "ב־Vercel: עדכנו את שלושת משתני Google לאותו OAuth Client והפיקו refresh token מחדש אם צריך."
        : isUnauthorizedClient
          ? "קוד Google unauthorized_client: ה־refresh token לא תואם ל־CLIENT_ID/SECRET הנוכחיים (למשל הופק מלקוח OAuth אחר). הפיקו refresh token חדש לאותו לקוח, או השתמשו בלקוח מסוג Desktop ב־Google Cloud."
          : "ב־.env.local: ודאו ש־GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET ו־GOOGLE_REFRESH_TOKEN מאותו OAuth Client, ואז refresh token חדש אם סובבתם Secret או בוטל הרשאה.";
    return {
      status: 503,
      error: `הרשאות Google Calendar נדחו. ${hint}${process.env.VERCEL === "1" ? "" : scriptHint}`,
      details: devDetails,
    };
  }

  return {
    status: 502,
    error: "יומן Google אינו זמין כרגע. נסו שוב מאוחר יותר.",
    details: devDetails,
  };
}
