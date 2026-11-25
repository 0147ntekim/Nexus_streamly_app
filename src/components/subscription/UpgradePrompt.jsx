import Button from "../common/Button.jsx";
import { getPlanName } from "../../utils/plans.js";
import styles from "./UpgradePrompt.module.css";

function UpgradePrompt({ requiredPlan = "premium", movieId }) {
  const planName = getPlanName(requiredPlan);

  return (
    <section className={styles.prompt}>
      <div className={styles.lock} aria-hidden="true">
        🔒
      </div>
      <h1 className={styles.title}>This title needs the {planName} plan</h1>
      <p className={styles.text}>
        Your current plan doesn't include this title. Upgrade to {planName} to
        watch it.
      </p>
      <div className={styles.actions}>
        <Button to={`/subscription?needs=${requiredPlan}`} size="lg">
          See the {planName} plan
        </Button>
        {movieId && (
          <Button to={`/movie/${movieId}`} variant="secondary" size="lg">
            Back to details
          </Button>
        )}
      </div>
    </section>
  );
}

export default UpgradePrompt;
