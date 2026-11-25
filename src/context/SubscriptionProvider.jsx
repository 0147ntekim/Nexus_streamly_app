import { useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext.js";
import { useAuth } from "../hooks/useAuth.js";
import { subscriptionService } from "../services/subscriptionService.js";
import { SubscriptionError } from "../services/subscriptionErrors.js";

function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // A new user gets fresh in-memory state instead of the previous user's plan.
  return (
    <SubscriptionForUser key={userId ?? "logged-out"} userId={userId}>
      {children}
    </SubscriptionForUser>
  );
}

function SubscriptionForUser({ children, userId }) {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!userId) return undefined;

    let isCancelled = false;

    async function loadSubscription() {
      try {
        const current = await subscriptionService.getSubscription(userId);
        if (!isCancelled) setSubscription(current);
      } catch (error) {
        if (!isCancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Couldn't load your simulated subscription."
          );
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadSubscription();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  const plan = subscription?.plan ?? "free";

  function requireUser() {
    if (!userId) {
      throw new SubscriptionError(
        "UNAUTHENTICATED",
        "Please log in to manage a plan."
      );
    }
    if (loadError) {
      throw new SubscriptionError(
        "SUBSCRIPTION_UNAVAILABLE",
        "Your subscription couldn't be verified. Reload the page and try again."
      );
    }
  }

  function startCheckout(planId) {
    requireUser();
    return subscriptionService.createCheckoutSession(userId, planId);
  }

  async function confirmPayment(reference, simulatedOutcome) {
    requireUser();
    const updated = await subscriptionService.confirmPayment(
      userId,
      reference,
      simulatedOutcome
    );
    setSubscription(updated);
    return updated;
  }

  async function cancelSubscription() {
    requireUser();
    const updated = await subscriptionService.cancelSubscription(userId);
    setSubscription(updated);
    return updated;
  }

  const value = {
    subscription,
    plan,
    isLoading,
    loadError,
    startCheckout,
    confirmPayment,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export default SubscriptionProvider;
