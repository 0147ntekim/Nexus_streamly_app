import { useNavigate } from "react-router-dom";
import Button from "../common/Button.jsx";
import Alert from "../common/Alert.jsx";
import FormField from "../common/FormField.jsx";
import PasswordField from "../common/PasswordField.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useForm } from "../../hooks/useForm.js";
import { validateSignupForm } from "../../utils/validators.js";

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isSubmitting,
    submitError,
  } = useForm({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    validate: validateSignupForm,
    onSubmit: async (formValues) => {
      await signup({
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
      });
      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please log in." },
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && <Alert variant="error">{submitError}</Alert>}
      <FormField
        id="signup-name"
        name="fullName"
        type="text"
        label="Full name"
        autoComplete="name"
        value={values.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("fullName")}
      />
      <FormField
        id="signup-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("email")}
      />
      <PasswordField
        id="signup-password"
        name="password"
        label="Password"
        autoComplete="new-password"
        hint="At least 8 characters, with a letter and a number."
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("password")}
      />
      <PasswordField
        id="signup-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("confirmPassword")}
      />
      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

export default SignupForm;
