import { useState } from "react";

export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setSubmitError("");
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const allTouched = Object.keys(values).reduce(
      (accumulator, name) => ({ ...accumulator, [name]: true }),
      {}
    );
    setTouched(allTouched);

    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getFieldError(name) {
    return touched[name] ? errors[name] : undefined;
  }

  return {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isSubmitting,
    submitError,
  };
}
