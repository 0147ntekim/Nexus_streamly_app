import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/common/Button.jsx";
import Alert from "../components/common/Alert.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import PageLoader from "../components/common/PageLoader.jsx";
import PlanCard from "../components/subscription/PlanCard.jsx";
import PlanComparisonTable from "../components/subscription/PlanComparisonTable.jsx";
import SubscriptionStatus from "../components/subscription/SubscriptionStatus.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { useSubscription } from "../hooks/useSubscription.js";
import { subscriptionService } from "../services/subscriptionService.js";
import { getPlanName } from "../utils/plans.js";
import styles from "./Subscription.module.css";

function Subscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const neededPlanId = searchParams.get("needs");

  const {
    plan: currentPlanId,
    subscription,
    isLoading: isSubscriptionLoading,
    loadError: subscriptionLoadError,
    cancelSubscription,
  } = useSubscription();
  const plansState = useFetch(() => subscriptionService.getPlans());

  const [isConfirmingSwitch, setIsConfirmingSwitch] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  function handleSelect(plan) {
    setNotice(null);
    if (plan.id === "free") {
      setIsConfirmingSwitch(true);
      return;
    }
    navigate(`/subscription/checkout/${plan.id}`);
  }

  async function handleConfirmSwitch() {
    setIsBusy(true);
    setNotice(null);
    try {
      await cancelSubscription();
      setNotice({
        variant: "success",
        text: "Your simulated plan is now Free.",
      });
    } catch (error) {
      setNotice({
        variant: "error",
        text:
          error instanceof Error
            ? error.message
            : "Couldn't change your simulated plan. Please try again.",
      });
    } finally {
      setIsBusy(false);
      setIsConfirmingSwitch(false);
    }
  }

  if (plansState.isLoading || isSubscriptionLoading) {
    return <PageLoader label="Loading plans..." />;
  }

  if (subscriptionLoadError) {
    return (
      <Container>
        <Section title="Your subscription couldn't be loaded">
          <ErrorMessage
            message={`${subscriptionLoadError} Reload the page and try again.`}
          />
        </Section>
      </Container>
    );
  }

  if (plansState.error) {
    return (
      <Container>
        <Section title="Plans">
          <ErrorMessage
            message={plansState.error.message}
            onRetry={plansState.refetch}
          />
        </Section>
      </Container>
    );
  }

  const plans = plansState.data ?? [];
  const hasNeededPlan =
    neededPlanId === "basic" || neededPlanId === "premium";

  return (
    <Container>
      <Section title="Choose your plan">
        <p className={styles.intro}>
          Plans show illustrative monthly prices in naira. All payment and
          activation flows are simulated; no real money is taken.
        </p>

        {hasNeededPlan && (
          <Alert variant="info">
            The title you tried to watch needs the {getPlanName(neededPlanId)}{" "}
            plan.
          </Alert>
        )}
        {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}

        {isConfirmingSwitch && (
          <Alert variant="info">
            <p>
              Switch your simulated plan to Free? You'll lose access to{" "}
              {getPlanName(currentPlanId)} titles right away. No simulated
              payment is refunded or charged.
            </p>
            <div className={styles.confirmActions}>
              <Button
                size="sm"
                onClick={handleConfirmSwitch}
                disabled={isBusy}
              >
                {isBusy ? "Switching..." : "Yes, switch to Free"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsConfirmingSwitch(false)}
                disabled={isBusy}
              >
                Keep my plan
              </Button>
            </div>
          </Alert>
        )}

        <div className={styles.grid}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={currentPlanId}
              isRecommended={hasNeededPlan && plan.id === neededPlanId}
              isBusy={isBusy}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </Section>

      <Section title="Compare plans">
        <PlanComparisonTable plans={plans} />
        <p className={styles.footnote}>
          *Illustrative only. The demo player does not enforce quality or
          simultaneous-screen limits.
        </p>
      </Section>

      {subscription && (
        <Section title="Your subscription">
          <SubscriptionStatus subscription={subscription} />
        </Section>
      )}
    </Container>
  );
}

export default Subscription;
