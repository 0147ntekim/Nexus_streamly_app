import { useState } from "react";
import FormField from "./FormField.jsx";
import styles from "./PasswordField.module.css";

function PasswordField(props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      {...props}
      type={isVisible ? "text" : "password"}
      rightElement={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}

export default PasswordField;
