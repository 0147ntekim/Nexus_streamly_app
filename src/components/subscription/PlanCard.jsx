import Button from "../common/Button.jsx";
import { formatPrice } from "../../utils/formatters.js";
import { getPlanRank } from "../../utils/plans.js";
import styles from "./PlanCard.module.css";

function PlanCard({
  plan,
  currentPlanId,
  isRecommended = false,
  isBusy = false,
  onSelect,
}) {
  const isCurrent = plan.id === currentPlanId;
  const isUpgrade = getPlanRank(plan.id) > getPlanRank(currentPlanId);

  let buttonLabel = `Switch to ${plan.name}`;
  if (isCurrent) buttonLabel = "Current plan";
  else if (isUpgrade) buttonLabel = `Upgrade to ${plan.name}`;

  const classes = [
    styles.card,
    plan.highlighted ? styles.highlighted : "",
    isCurrent ? styles.current : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes} aria-label={`${plan.name} plan`}>
      {isRecommended ? (
        <span className={styles.ribbon}>Needed for this title</span>
      ) : (
        plan.highlighted && <span className={styles.ribbon}>Most popular</span>
      )}

      <h2 className={styles.name}>{plan.name}</h2>
      <p className={styles.tagline}>{plan.tagline}</p>

      <p className={styles.price}>
        <span className={styles.amount}>{formatPrice(plan.priceNgn)}</span>
        <span className={styles.period}> / month</span>
      </p>

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <Button
        fullWidth
        variant={isCurrent ? "ghost" : plan.highlighted ? "primary" : "secondary"}
        disabled={isCurrent || isBusy}
        onClick={() => onSelect(plan)}
      >
        {buttonLabel}
      </Button>
    </article>
  );
}

export default PlanCard;
