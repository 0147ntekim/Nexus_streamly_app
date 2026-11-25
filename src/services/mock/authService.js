/**
 * ============================================================
 *  MOCK AUTHENTICATION: A LEARNING SIMULATION ONLY
 * ============================================================
 * This stores users and sessions in the browser's localStorage.
 * It is NOT secure and must NEVER be used in production.
 * Anyone can open DevTools and read or edit localStorage.
 * Real password checking must happen on a server.
 * Real sessions use secure, server-managed cookies or properly
 * implemented access/refresh tokens.
 */
import { AuthError } from "../authErrors.js";

const USERS_KEY = "streamly_mock_users";
const SESSION_KEY = "streamly_mock_session";
const SESSION_DAYS = 7;
const SIMULATED_DELAY_MS = 600;

const delay = (ms = SIMULATED_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function assertCryptoAvailable() {
  if (!window.crypto?.subtle || !window.crypto.randomUUID) {
    throw new AuthError(
      "CRYPTO_UNAVAILABLE",
      "This demo needs a secure context. Open the app on localhost or over HTTPS."
    );
  }
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toPublicUser(record) {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    plan: record.plan,
    createdAt: record.createdAt,
  };
}

async function register({ fullName, email, password }) {
  await delay();
  assertCryptoAvailable();

  const normalizedEmail = email.trim().toLowerCase();
  const users = readJson(USERS_KEY, []);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new AuthError("EMAIL_TAKEN", "An account with this email already exists.");
  }

  const salt = window.crypto.randomUUID();
  const record = {
    id: window.crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
    plan: "free",
    createdAt: new Date().toISOString(),
  };

  writeJson(USERS_KEY, [...users, record]);
  return toPublicUser(record);
}

async function login({ email, password }) {
  await delay();
  assertCryptoAvailable();

  const normalizedEmail = email.trim().toLowerCase();
  const users = readJson(USERS_KEY, []);
  const record = users.find((user) => user.email === normalizedEmail);
  const invalid = new AuthError("INVALID_CREDENTIALS", "Incorrect email or password.");

  if (!record) throw invalid;

  const hash = await hashPassword(password, record.salt);
  if (hash !== record.passwordHash) throw invalid;

  writeJson(SESSION_KEY, {
    userId: record.id,
    token: `mock-${window.crypto.randomUUID()}`,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  });

  return toPublicUser(record);
}

async function logout() {
  await delay(200);
  localStorage.removeItem(SESSION_KEY);
}

async function getCurrentUser() {
  await delay(400);

  const session = readJson(SESSION_KEY, null);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  const users = readJson(USERS_KEY, []);
  const record = users.find((user) => user.id === session.userId);
  if (!record) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  return toPublicUser(record);
}

export const authService = { register, login, logout, getCurrentUser };
