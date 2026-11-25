/**
 * MOCK ACCESS RULES: A LEARNING SIMULATION.
 * A real catalogue database would include each licensed title's required plan.
 */
export function getRequiredPlan(movieId) {
  const id = Number(movieId);
  if (!Number.isInteger(id) || id < 0) return "free";
  if (id % 4 === 0) return "premium";
  if (id % 4 === 1) return "basic";
  return "free";
}
