import { useParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import PageLoader from "../components/common/PageLoader.jsx";
import CheckoutForm from "../components/subscription/CheckoutForm.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { useSubscription } from "../hooks/useSubscription.js";
import { subscriptionService } from "../services/subscriptionService.js";

function Checkout() {
  const { planId } = useParams();
  const plansState = useFetch(() => subscriptionService.getPlans());
  const { isLoading: isSubscriptionLoading, loadError } = useSubscription();

  if (plansState.isLoading || isSubscriptionLoading) {
    return <PageLoader label="Loading checkout..." />;
  }

  if (loadError) {
    return (
      <Container>
        <Section title="Checkout unavailable">
          <ErrorMessage
            message={`${loadError} Reload the page and try again.`}
          />
        </Section>
      </Container>
    );
  }

  if (plansState.error) {
    return (
      <Container>
        <Section title="Checkout">
          <ErrorMessage
            message={plansState.error.message}
            onRetry={plansState.refetch}
          />
        </Section>
      </Container>
    );
  }

  const plan = (plansState.data ?? []).find(
    (candidate) => candidate.id === planId
  );

  if (!plan || plan.priceNgn === 0) {
    return (
      <Container>
        <Section title="Plan not found">
          <p>That plan can't be purchased in this simulation.</p>
          <p style={{ marginTop: "var(--space-3)" }}>
            <Button to="/subscription" variant="secondary">
              Back to plans
            </Button>
          </p>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section title={`Checkout: ${plan.name}`}>
        <CheckoutForm key={plan.id} plan={plan} />
      </Section>
    </Container>
  );
}

export default Checkout;
