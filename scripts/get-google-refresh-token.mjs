/**
 * Mint a new GOOGLE_REFRESH_TOKEN for the same OAuth client as in .env.local.
 *
 * Why: `unauthorized_client` from Google means the refresh token was not issued
 * for this exact GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (or the client type / redirect URIs are wrong).
 *
 * Usage (from repo root `studio-rent/`):
 *   node scripts/get-google-refresh-token.mjs
 *
 * Google Cloud Console (same project as the OAuth client):
 *   - APIs & Services → OAuth consent screen: add test users if app is "Testing".
 *   - APIs & Services → Credentials → your OAuth 2.0 Client:
 *     - Application type **Desktop** is simplest: no redirect URI list for loopback.
 *     - If type is **Web application**, add this Authorized redirect URI exactly:
 *         http://127.0.0.1:46473/oauth2callback
 *
 * Then paste the printed line into `.env.local`, restart `npm run dev`.
 */

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { OAuth2Client } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

function loadDotEnvLocal() {
  if (!existsSync(ENV_PATH)) {
    console.error("Missing .env.local at", ENV_PATH);
    process.exit(1);
  }
  const text = readFileSync(ENV_PATH, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const i = s.indexOf("=");
    if (i < 1) continue;
    const key = s.slice(0, i).trim();
    let val = s.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const PORT = 46473;
const REDIRECT_PATH = "/oauth2callback";
const REDIRECT_URI = `http://127.0.0.1:${PORT}${REDIRECT_PATH}`;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

async function main() {
  loadDotEnvLocal();
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    console.error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local");
    process.exit(1);
  }

  const oauth2Client = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: REDIRECT_URI,
  });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n1) In Google Cloud → Credentials, use the **same** OAuth client as in .env.local.");
  console.log(
    "   If it is a **Web** client, add Authorized redirect URI:\n   " + REDIRECT_URI,
  );
  console.log("   **Desktop** clients usually work without adding this URI.\n");
  console.log("2) Open this URL in the browser (studio Google account):\n\n" + authUrl + "\n");

  await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
        if (url.pathname !== REDIRECT_PATH) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        if (err) {
          res.end(`<p>Google returned error: <code>${err}</code></p>`);
          console.error("OAuth error:", err, url.searchParams.get("error_description") || "");
          server.close();
          reject(new Error(err));
          return;
        }
        if (!code) {
          res.end("<p>No code in URL.</p>");
          server.close();
          reject(new Error("missing code"));
          return;
        }
        res.end("<p>OK — you can close this tab. Refresh token is printed in the terminal.</p>");
        const { tokens } = await oauth2Client.getToken(code);
        server.close();
        if (!tokens.refresh_token) {
          console.warn(
            "\nNo refresh_token in response. Try again after revoking app access at\n" +
              "https://myaccount.google.com/permissions — then rerun this script.\n",
          );
          console.log("access_token (short-lived) was returned; not enough for the server app.\n");
        } else {
          console.log("\nAdd / replace this line in .env.local:\n");
          console.log("GOOGLE_REFRESH_TOKEN=" + tokens.refresh_token + "\n");
        }
        resolve();
      } catch (e) {
        server.close();
        reject(e);
      }
    });

    server.listen(PORT, "127.0.0.1", () => {
      console.log("Listening on " + REDIRECT_URI + " …\n");
    });
    server.on("error", reject);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
