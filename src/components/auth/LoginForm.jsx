import Button from "../common/Button.jsx";
import Alert from "../common/Alert.jsx";
import FormField from "../common/FormField.jsx";
import PasswordField from "../common/PasswordField.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useForm } from "../../hooks/useForm.js";
import { validateLoginForm } from "../../utils/validators.js";

function LoginForm() {
  const { login } = useAuth();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isSubmitting,
    submitError,
  } = useForm({
    initialValues: { email: "", password: "" },
    validate: validateLoginForm,
    onSubmit: (formValues) =>
      login({ email: formValues.email, password: formValues.password }),
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && <Alert variant="error">{submitError}</Alert>}
      <FormField
        id="login-email"
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
        id="login-password"
        name="password"
        label="Password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("password")}
      />
      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export default LoginForm;
