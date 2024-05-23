const jose = require("jose");
const createError = require("http-errors");

const ACCESS_TOKEN_SECRET = Buffer.from(process.env.ACCESS_TOKEN_SECRET, "hex");
const REFRESH_TOKEN_SECRET = Buffer.from(
  process.env.REFRESH_TOKEN_SECRET,
  "hex"
);

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

// Token header for: { alg: "dir", enc: "A256GCM" }
const TOKEN_HEADER = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..";

async function generateTokens(payload) {
  let access_token = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .encrypt(ACCESS_TOKEN_SECRET);
  let refresh_token = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .encrypt(REFRESH_TOKEN_SECRET);

  access_token = access_token.slice(TOKEN_HEADER.length);
  refresh_token = refresh_token.slice(TOKEN_HEADER.length);
  return { access_token, refresh_token };
}

async function verifyAccessToken(token) {
  try {
    token = TOKEN_HEADER.concat(token);
    let { payload } = await jose.jwtDecrypt(token, ACCESS_TOKEN_SECRET, {
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    });
    return payload;
  } catch (err) {
    if (err.name === "JWTExpired")
      throw createError.Unauthorized(`Expired token`);
    if (err.name === "JWEDecryptionFailed" || err.name === "JWEInvalid")
      throw createError.Unauthorized(`Invalide token`);
    throw err;
  }
}

async function verifyRefreshToken(token) {
  try {
    token = TOKEN_HEADER.concat(token);
    let { payload } = await jose.jwtDecrypt(token, REFRESH_TOKEN_SECRET, {
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    });
    return payload;
  } catch (err) {
    if (err.name === "JWTExpired") return "Expired token";
    if (err.name === "JWEDecryptionFailed" || err.name === "JWEInvalid")
      return "Invalid token";
    return err.name; // Return the error name if it's not handled explicitly
  }
}

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };
