import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useSubscription } from "../hooks/useSubscription.js";
import { useWatchlist } from "../hooks/useWatchlist.js";
import { getPlanName } from "../utils/plans.js";

function Profile() {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const { items, isLoading, loadError } = useWatchlist();

  return (
    <Container>
      <Section title="Your profile">
        <p>Name: {user.fullName}</p>
        <p>Email: {user.email}</p>
        <p>Plan: {getPlanName(plan)}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>
          Watchlist: {isLoading ? "loading..." : `${items.length} movie(s)`}
        </p>
        {loadError && <p role="alert">Watchlist error: {loadError}</p>}
      </Section>
    </Container>
  );
}

export default Profile;