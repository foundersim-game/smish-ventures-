#!/usr/bin/env node

/**
 * CHAOS — Apple Client Secret (JWT) Generator
 * 
 * Generates the 6-month client secret JWT required by Supabase Auth for Apple OAuth.
 * Usage: node scripts/generate-apple-secret.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TEAM_ID = process.env.APPLE_TEAM_ID || "4SV4NMHB82";
const KEY_ID = process.env.APPLE_KEY_ID || "P269LAMF38";
const CLIENT_ID = process.env.APPLE_CLIENT_ID || "com.chaos.partygame.web";

// Locate .p8 file
const candidates = [
  path.join(process.env.HOME || "", "Downloads", `AuthKey_${KEY_ID}.p8`),
  path.join(__dirname, `AuthKey_${KEY_ID}.p8`),
  path.join(__dirname, "..", `AuthKey_${KEY_ID}.p8`),
];

let p8Path = candidates.find((p) => fs.existsSync(p));

if (!p8Path) {
  // Search downloads for any AuthKey_*.p8
  const downloads = path.join(process.env.HOME || "", "Downloads");
  if (fs.existsSync(downloads)) {
    const files = fs.readdirSync(downloads).filter((f) => f.startsWith("AuthKey_") && f.endsWith(".p8"));
    if (files.length > 0) {
      p8Path = path.join(downloads, files[0]);
    }
  }
}

if (!p8Path || !fs.existsSync(p8Path)) {
  console.error("❌ Could not find AuthKey .p8 file. Please place it in ~/Downloads or pass its path.");
  process.exit(1);
}

const privateKey = fs.readFileSync(p8Path, "utf8");

// Apple allows max 180 days (15,552,000 seconds)
const now = Math.floor(Date.now() / 1000);
const exp = now + 15552000;

const header = {
  alg: "ES256",
  kid: KEY_ID,
  typ: "JWT",
};

const payload = {
  iss: TEAM_ID,
  iat: now,
  exp: exp,
  aud: "https://appleid.apple.com",
  sub: CLIENT_ID,
};

function base64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));
const dataToSign = `${encodedHeader}.${encodedPayload}`;

const sign = crypto.createSign("SHA256");
sign.update(dataToSign);
sign.end();

const signature = sign.sign({
  key: privateKey,
  dsaEncoding: "ieee-p1363",
});

const encodedSignature = signature
  .toString("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

const jwt = `${dataToSign}.${encodedSignature}`;

console.log("\n=======================================================");
console.log("🍏 CHAOS Apple Client Secret JWT Generated Successfully");
console.log("=======================================================");
console.log(`Team ID:      ${TEAM_ID}`);
console.log(`Key ID:       ${KEY_ID}`);
console.log(`Client ID:    ${CLIENT_ID}`);
console.log(`Key File:     ${p8Path}`);
console.log(`Valid until:  ${new Date(exp * 1000).toLocaleString()}`);
console.log("\n--- COPY THE JWT BELOW AND PASTE INTO SUPABASE ---");
console.log(jwt);
console.log("---------------------------------------------------\n");
