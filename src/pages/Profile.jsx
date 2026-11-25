import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Profile() {
  const { user } = useAuth();

  return (
    <Container>
      <Section title="Your profile">
        <p>Name: {user.fullName}</p>
        <p>Email: {user.email}</p>
        <p>Plan: {user.plan}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      </Section>
    </Container>
  );
}

export default Profile;