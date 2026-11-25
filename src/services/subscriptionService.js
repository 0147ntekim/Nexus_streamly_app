/**
 * The only subscription module the rest of the app imports. A production
 * implementation should call our backend, which verifies provider payments
 * before updating a subscription. Provider secrets never belong in the app.
 */
export { subscriptionService } from "./mock/subscriptionService.js";
