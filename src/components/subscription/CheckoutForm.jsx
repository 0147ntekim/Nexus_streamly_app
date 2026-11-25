import { useState } from "react";
import Button from "../common/Button.jsx";
import Alert from "../common/Alert.jsx";
import PageLoader from "../common/PageLoader.jsx";
import { useSubscription } from "../../hooks/useSubscription.js";
import {
  formatPrice,
  formatIsoDate,
} from "../../utils/formatters.js";
import styles from "./CheckoutForm.module.css";

function CheckoutForm({ plan }) {
  const {
    plan: currentPlanId,
    startCheckout,
    confirmPayment,
  } = useSubscription();
  const [step, setStep] = useState("review");
  const [errorMessage, setErrorMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  const isAlreadyOnPlan = currentPlanId === plan.id && step === "review";

  async function handlePay(simulatedOutcome) {
    setStep("processing");
    setErrorMessage("");
    try {
      const session = await startCheckout(plan.id);
      const subscription = await confirmPayment(
        session.reference,
        simulatedOutcome
      );
      setReceipt({ reference: session.reference, subscription });
      setStep("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The simulated checkout failed. Please try again."
      );
      setStep("failed");
    }
  }

  if (step === "processing") {
    return <PageLoader label="Confirming your simulated payment..." />;
  }

  if (step === "success") {
    return (
      <div className={styles.result}>
        <Alert variant="success">
          Simulated payment confirmed. Your {plan.name} plan is now active in
          this simulation. No real money moved.
        </Alert>
        <p>Simulated reference: {receipt.reference}</p>
        <p>
          Next simulated billing date:{" "}
          {formatIsoDate(receipt.subscription.renewsAt)}
        </p>
        <div className={styles.actions}>
          <Button to="/browse" size="lg">
            Start watching
          </Button>
          <Button to="/subscription" variant="secondary" size="lg">
            View my plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <section className={styles.summary} aria-label="Order summary">
        <h2 className={styles.heading}>Order summary</h2>
        <p className={styles.planName}>{plan.name} plan</p>
        <p className={styles.price}>
          {formatPrice(plan.priceNgn)}{" "}
          <span className={styles.period}>/ month</span>
        </p>
        <ul className={styles.features}>
          {plan.features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>
        <p className={styles.small}>
          Simulated, illustrative price. No real money will be charged.
        </p>
      </section>

      <section className={styles.payment} aria-label="Simulated payment">
        <h2 className={styles.heading}>Payment simulation</h2>

        <Alert variant="info">
          <strong>This checkout is simulated.</strong> No real payment is taken
          and no card details are collected. In production, a secure hosted
          checkout would be used and your backend would verify payment before
          granting access.
        </Alert>

        {step === "failed" && <Alert variant="error">{errorMessage}</Alert>}
        {isAlreadyOnPlan && (
          <Alert variant="info">
            You're already on the {plan.name} plan in this simulation.
          </Alert>
        )}

        <div className={styles.buttons}>
          <Button
            size="lg"
            fullWidth
            disabled={isAlreadyOnPlan}
            onClick={() => handlePay("success")}
          >
            Simulate successful payment
          </Button>
          <Button
            size="lg"
            fullWidth
            variant="ghost"
            disabled={isAlreadyOnPlan}
            onClick={() => handlePay("failed")}
          >
            Simulate failed payment
          </Button>
          <Button to="/subscription" variant="secondary" fullWidth>
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
}

export default CheckoutForm;
