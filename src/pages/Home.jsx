import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Home() {
  const { user } = useAuth();
  const firstName = user.fullName.split(" ")[0];

  return (
    <Container>
      <Section title={`Welcome back, ${firstName}`}>
        <p>Your dashboard is coming in a later stage.</p>
      </Section>
    </Container>
  );
}

export default Home;