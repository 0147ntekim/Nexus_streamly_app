export function formatYear(dateString) {
  if (!dateString) return "N/A";
  return dateString.slice(0, 4);
}

export function formatRating(vote) {
  if (typeof vote !== "number" || vote === 0) return "NR";
  return vote.toFixed(1);
}