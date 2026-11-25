const PLAN_RANK = { free: 0, basic: 1, premium: 2 };
const PLAN_NAMES = { free: "Free", basic: "Basic", premium: "Premium" };

export function getPlanRank(planId) {
  return Object.prototype.hasOwnProperty.call(PLAN_RANK, planId)
    ? PLAN_RANK[planId]
    : 0;
}

export function getPlanName(planId) {
  return Object.prototype.hasOwnProperty.call(PLAN_NAMES, planId)
    ? PLAN_NAMES[planId]
    : "Free";
}

export function canAccess(userPlanId, requiredPlanId) {
  return getPlanRank(userPlanId) >= getPlanRank(requiredPlanId);
}
