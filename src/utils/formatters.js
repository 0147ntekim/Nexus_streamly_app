export function formatYear(dateString) {
  if (!dateString) return "N/A";
  return dateString.slice(0, 4);
}

export function formatRating(vote) {
  if (typeof vote !== "number" || vote === 0) return "NR";
  return vote.toFixed(1);
}

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder}m`;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}