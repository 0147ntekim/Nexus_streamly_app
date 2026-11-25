import { formatPrice } from "../../utils/formatters.js";
import { canAccess } from "../../utils/plans.js";
import styles from "./PlanComparisonTable.module.css";

function Included({ isIncluded }) {
  return isIncluded ? (
    <span aria-label="Included">✓</span>
  ) : (
    <span aria-label="Not included" className={styles.no}>
      —
    </span>
  );
}

const ROWS = [
  { label: "Monthly price", render: (plan) => formatPrice(plan.priceNgn) },
  {
    label: "Free titles",
    render: (plan) => <Included isIncluded={canAccess(plan.id, "free")} />,
  },
  {
    label: "Basic titles",
    render: (plan) => <Included isIncluded={canAccess(plan.id, "basic")} />,
  },
  {
    label: "Premium titles",
    render: (plan) => <Included isIncluded={canAccess(plan.id, "premium")} />,
  },
  {
    label: "Watchlist and resume playback",
    render: () => <Included isIncluded />,
  },
  { label: "Streaming quality*", render: (plan) => plan.quality },
  { label: "Simultaneous screens*", render: (plan) => plan.screens },
];

function PlanComparisonTable({ plans }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className="sr-only">Comparison of subscription plans</caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            {plans.map((plan) => (
              <th scope="col" key={plan.id}>
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {plans.map((plan) => (
                <td key={plan.id}>{row.render(plan)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanComparisonTable;
