import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/common/Button.jsx";
import HeroBanner from "../components/movies/HeroBanner.jsx";
import MovieRow from "../components/movies/MovieRow.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./Landing.module.css";
import { getTrendingMovies } from "../services/tmdb/movieService.js"


const FEATURES = [
  {
    title: "Discover something new",
    text: "Browse trending, popular and top-rated films, or search for exactly what you want.",
  },
  {
    title: "Simple monthly plans",
    text: "Start free, then upgrade when you're ready. Plans are priced in naira.",
  },
  {
    title: "Made for every screen",
    text: "A layout that works on your phone, tablet and computer.",
  },
];

function Landing() {
  const { data: trending, isLoading, error, refetch } = useFetch(getTrendingMovies);
  const { isAuthenticated } = useAuth();

  const featured = trending?.find((movie) => movie.backdrop_path) ?? null;

  const heroActions = isAuthenticated ? (
    <Button to="/home" size="lg">
      Go to your dashboard
    </Button>
  ) : (
    <>
      <Button to="/signup" size="lg">
        Get started
      </Button>
      <Button to="/login" variant="secondary" size="lg">
        Log in
      </Button>
    </>
  );

  return (
    <>
      <HeroBanner movie={featured} isLoading={isLoading} actions={heroActions} />

      <Container>
        <Section title="Why Streamly?">
          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <article key={feature.title} className={styles.feature}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <MovieRow
          title="Trending this week"
          movies={(trending ?? []).slice(0, 12)}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />

        {!isAuthenticated && (
          <section className={styles.cta}>
            <h2>Ready to start watching?</h2>
            <p>Create a free account and pick a plan whenever you like.</p>
            <div className={styles.ctaButtons}>
              <Button to="/signup" size="lg">
                Create free account
              </Button>
              <Button to="/subscription" variant="ghost" size="lg">
                See plans
              </Button>
            </div>
          </section>
        )}
      </Container>
    </>
  );
}

export default Landing;