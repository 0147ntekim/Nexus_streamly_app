import { getPlanName } from "../../utils/plans.js";
import styles from "./PlanBadge.module.css";

function PlanBadge({ plan }) {
  if (!plan || plan === "free") return null;
  return (
    <span className={`${styles.badge} ${styles[plan]}`}>
      {getPlanName(plan)}
    </span>
  );
}

export default PlanBadge;
