import { formatIsoDate } from "../../utils/formatters.js";
import { getPlanName } from "../../utils/plans.js";
import styles from "./SubscriptionStatus.module.css";

function SubscriptionStatus({ subscription }) {
  const hasPaidTier = subscription.plan !== "free";

  return (
    <div className={styles.status}>
      <p className={styles.plan}>
        Current plan: <strong>{getPlanName(subscription.plan)}</strong>
      </p>
      {hasPaidTier ? (
        <>
          <p>Simulated status: {subscription.status}</p>
          <p>Simulated start date: {formatIsoDate(subscription.startedAt)}</p>
          <p>
            Next simulated billing date:{" "}
            {formatIsoDate(subscription.renewsAt)}
          </p>
          <p className={styles.note}>
            This subscription is simulated: no real payment was taken and
            nothing renews automatically.
          </p>
        </>
      ) : (
        <p>You're on the Free plan. No simulated billing applies.</p>
      )}
    </div>
  );
}

export default SubscriptionStatus;
