import { SHA256, enc, lib } from "crypto-js";

export function generateRandomString() {
  return lib.WordArray.random(16).toString(enc.Hex);
}
export function generateCodeChallenge() {
  const codeVerifier = generateRandomString();
  const hash = SHA256(codeVerifier);
  const codeChallenge = hash
    .toString(enc.Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return { codeVerifier, codeChallenge };
}
