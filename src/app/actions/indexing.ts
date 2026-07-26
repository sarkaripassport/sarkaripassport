"use server";

import { getSettings } from "@/lib/db";
import crypto from "crypto";

// Helper to base64url encode
function base64url(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Generate Google Indexing API access token using private key (JWT authentication)
async function getGoogleAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const jwtHeader = { alg: "RS256", typ: "JWT" };
  
  const now = Math.floor(Date.now() / 1000);
  const jwtClaim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: sa.token_uri || "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64url(JSON.stringify(jwtHeader));
  const encodedClaim = base64url(JSON.stringify(jwtClaim));
  const signingInput = `${encodedHeader}.${encodedClaim}`;

  // Sign using Node's crypto module (RS256 signature)
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(sa.private_key);
  const signedJwt = `${signingInput}.${base64url(signature)}`;

  // Exchange JWT for access token
  const response = await fetch(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Google Auth failed: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

// Server Action to trigger instant indexing
export async function requestInstantIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    const settings = await getSettings();
    const results: { google?: { success: boolean; msg: string }; bing?: { success: boolean; msg: string } } = {};

    // 1. Google Indexing API
    if (settings.indexing?.google_json) {
      try {
        const token = await getGoogleAccessToken(settings.indexing.google_json);
        const gResponse = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            url: url,
            type: type
          })
        });

        const gData = await gResponse.json();
        if (gResponse.ok) {
          results.google = { success: true, msg: "URL successfully sent for indexing to Google." };
        } else {
          results.google = { success: false, msg: gData.error?.message || "Google Indexing API returned error." };
        }
      } catch (err: any) {
        console.error("Google Indexing error:", err);
        results.google = { success: false, msg: err.message || "Failed to authenticate or contact Google." };
      }
    } else {
      results.google = { success: false, msg: "Google Indexing credentials not configured in settings." };
    }

    // 2. Bing IndexNow API
    if (settings.indexing?.indexnow_key) {
      try {
        const key = settings.indexing.indexnow_key;
        const host = new URL(url).host;
        const indexNowUrl = `https://api.indexnow.org/IndexNow?url=${encodeURIComponent(url)}&key=${key}&keyLocation=${encodeURIComponent(`https://${host}/${key}.txt`)}`;
        
        const bResponse = await fetch(indexNowUrl);
        if (bResponse.ok) {
          results.bing = { success: true, msg: "URL successfully sent to Bing IndexNow." };
        } else {
          results.bing = { success: false, msg: `Bing IndexNow returned HTTP status ${bResponse.status}.` };
        }
      } catch (err: any) {
        console.error("IndexNow error:", err);
        results.bing = { success: false, msg: err.message || "Failed to ping Bing IndexNow." };
      }
    } else {
      results.bing = { success: false, msg: "IndexNow key not configured in settings." };
    }

    return { success: true, results };
  } catch (error: any) {
    console.error("Global indexing error:", error);
    return { success: false, error: error.message || "Indexing request failed." };
  }
}
