// A custom error type so the UI can tell auth problems apart from bugs.
// `code` is a machine-readable reason (e.g. "EMAIL_TAKEN"),
// `message` is safe to show to the user.
export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
