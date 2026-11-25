import { Link, useLocation } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";
import Alert from "../components/common/Alert.jsx";

function Login() {
  const location = useLocation();
  const successMessage = location.state?.message;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue watching."
      footer={<>New to Streamly? <Link to="/signup">Create an account</Link></>}
    >
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <LoginForm />
    </AuthCard>
  );
}

export default Login;