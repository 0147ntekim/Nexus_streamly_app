/**
 * ============================================================
 *  MOCK SUBSCRIPTION SERVICE: A LEARNING SIMULATION ONLY
 * ============================================================
 * No real payment is taken. This demo stores simulated subscription state
 * in localStorage, which is not secure and can be edited by the user.
 * A real backend must verify payments with the provider before changing a
 * subscription in its database.
 */
import { SubscriptionError } from "../subscriptionErrors.js";

const SUBSCRIPTIONS_KEY = "streamly_mock_subscriptions";
const CHECKOUTS_KEY = "streamly_mock_checkouts";
const BILLING_PERIOD_DAYS = 30;
const SIMULATED_DELAY_MS = 700;

const PLANS = [
  {
    id: "free",
    name: "Free",
    priceNgn: 0,
    tagline: "Start watching at no cost",
    quality: "SD",
    screens: 1,
    features: ["Access to free titles", "Watchlist and resume playback"],
  },
  {
    id: "basic",
    name: "Basic",
    priceNgn: 2500,
    tagline: "More titles, better quality",
    quality: "HD",
    screens: 2,
    features: ["Everything in Free", "Access to Basic titles", "HD streaming"],
  },
  {
    id: "premium",
    name: "Premium",
    priceNgn: 5000,
    tagline: "The full catalogue",
    quality: "Full HD",
    screens: 4,
    highlighted: true,
    features: [
      "Everything in Basic",
      "Access to Premium titles",
      "Full HD streaming",
      "Up to 4 screens",
    ],
  },
];

const delay = (ms = SIMULATED_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function requireUserId(userId) {
  if (!userId) {
    throw new SubscriptionError("UNAUTHENTICATED", "Please log in to manage a plan.");
  }
}

function assertCryptoAvailable() {
  if (!window.crypto?.randomUUID) {
    throw new SubscriptionError(
      "CRYPTO_UNAVAILABLE",
      "This demo needs a secure context. Open the app on localhost or over HTTPS."
    );
  }
}

function freeSubscription() {
  return {
    plan: "free",
    status: "active",
    startedAt: null,
    renewsAt: null,
    reference: null,
    isSimulated: true,
  };
}

async function getPlans() {
  await delay(300);
  return PLANS.map((plan) => ({ ...plan, features: [...plan.features] }));
}

async function getSubscription(userId) {
  requireUserId(userId);
  await delay(200);
  return readJson(SUBSCRIPTIONS_KEY, {})[userId] ?? freeSubscription();
}

async function createCheckoutSession(userId, planId) {
  requireUserId(userId);
  await delay(400);
  assertCryptoAvailable();

  const plan = PLANS.find((candidate) => candidate.id === planId);
  if (!plan || plan.priceNgn === 0) {
    throw new SubscriptionError("INVALID_PLAN", "That plan can't be purchased.");
  }

  // Step one of the simulation records a pending session without contacting a provider.
  const reference = `SIM-${window.crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const session = {
    reference,
    userId,
    planId: plan.id,
    amountNgn: plan.priceNgn,
    currency: "NGN",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  writeJson(CHECKOUTS_KEY, {
    ...readJson(CHECKOUTS_KEY, {}),
    [reference]: session,
  });
  return {
    reference,
    planId: plan.id,
    amountNgn: plan.priceNgn,
    currency: "NGN",
  };
}

async function confirmPayment(userId, reference, simulatedOutcome = "success") {
  requireUserId(userId);
  await delay();

  const checkouts = readJson(CHECKOUTS_KEY, {});
  const session = checkouts[reference];
  if (!session || session.userId !== userId) {
    throw new SubscriptionError(
      "SESSION_NOT_FOUND",
      "We couldn't find that simulated checkout session."
    );
  }

  if (session.status === "paid") {
    return readJson(SUBSCRIPTIONS_KEY, {})[userId] ?? freeSubscription();
  }
  if (session.status !== "pending") {
    throw new SubscriptionError(
      "SESSION_CLOSED",
      "This simulated checkout session is no longer available."
    );
  }

  const plan = PLANS.find((candidate) => candidate.id === session.planId);
  if (
    !plan ||
    plan.priceNgn !== session.amountNgn ||
    session.currency !== "NGN"
  ) {
    throw new SubscriptionError(
      "INVALID_SESSION",
      "The simulated checkout details couldn't be verified."
    );
  }

  if (simulatedOutcome !== "success" && simulatedOutcome !== "failed") {
    throw new SubscriptionError(
      "INVALID_OUTCOME",
      "That simulated payment outcome isn't supported."
    );
  }

  if (simulatedOutcome === "failed") {
    writeJson(CHECKOUTS_KEY, {
      ...checkouts,
      [reference]: { ...session, status: "failed" },
    });
    throw new SubscriptionError(
      "PAYMENT_FAILED",
      "The simulated payment failed. No money was taken. You can try again."
    );
  }

  const now = new Date();
  const renewsAt = new Date(
    now.getTime() + BILLING_PERIOD_DAYS * 24 * 60 * 60 * 1000
  );
  const subscription = {
    plan: session.planId,
    status: "active",
    startedAt: now.toISOString(),
    renewsAt: renewsAt.toISOString(),
    reference,
    isSimulated: true,
  };

  // Only this service updates the simulated subscription after confirmation.
  writeJson(SUBSCRIPTIONS_KEY, {
    ...readJson(SUBSCRIPTIONS_KEY, {}),
    [userId]: subscription,
  });
  writeJson(CHECKOUTS_KEY, {
    ...checkouts,
    [reference]: { ...session, status: "paid" },
  });
  return subscription;
}

async function cancelSubscription(userId) {
  requireUserId(userId);
  await delay(400);
  const all = { ...readJson(SUBSCRIPTIONS_KEY, {}) };
  delete all[userId];
  writeJson(SUBSCRIPTIONS_KEY, all);
  return freeSubscription();
}

export const subscriptionService = {
  getPlans,
  getSubscription,
  createCheckoutSession,
  confirmPayment,
  cancelSubscription,
};
