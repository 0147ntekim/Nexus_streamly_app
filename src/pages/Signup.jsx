import { Link } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard.jsx";
import SignupForm from "../components/auth/SignupForm.jsx";

function Signup() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start with a free plan. Upgrade any time."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <SignupForm />
    </AuthCard>
  );
}

export default Signup;