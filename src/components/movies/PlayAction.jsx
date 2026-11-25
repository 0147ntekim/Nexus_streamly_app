import Alert from "../common/Alert.jsx";
import Button from "../common/Button.jsx";
import { useSubscription } from "../../hooks/useSubscription.js";
import { getRequiredPlan } from "../../services/mock/accessRules.js";
import { canAccess, getPlanName } from "../../utils/plans.js";

function PlayAction({ movieId, size = "lg" }) {
  const { plan, isLoading, loadError } = useSubscription();
  const requiredPlan = getRequiredPlan(movieId);

  if (isLoading) {
    return (
      <Button size={size} disabled>
        ▶ Play
      </Button>
    );
  }

  if (loadError) {
    return (
      <Alert variant="error">
        Your plan couldn't be verified, so playback is unavailable.
      </Alert>
    );
  }

  if (canAccess(plan, requiredPlan)) {
    return (
      <Button to={`/watch/${movieId}`} size={size}>
        ▶ Play
      </Button>
    );
  }

  return (
    <Button
      to={`/subscription?needs=${requiredPlan}`}
      size={size}
      variant="secondary"
    >
      🔒 Upgrade to {getPlanName(requiredPlan)}
    </Button>
  );
}

export default PlayAction;
