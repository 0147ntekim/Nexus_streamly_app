export class SubscriptionError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SubscriptionError";
    this.code = code;
  }
}
