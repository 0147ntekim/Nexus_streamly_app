/**
 * ============================================================
 *  DEMO VIDEO PROVIDER: A LEARNING SIMULATION ONLY
 * ============================================================
 * TMDB provides movie information, not movie files, and this app has no
 * streaming rights to commercial titles. It uses freely licensed Blender
 * Foundation films with attribution in the UI. The hosted demo URLs can
 * occasionally be unavailable.
 */
import { PlaybackError } from "./playbackErrors.js";
import { authService } from "../authService.js";
import { subscriptionService } from "../subscriptionService.js";
import { getRequiredPlan } from "../mock/accessRules.js";
import { canAccess, getPlanName } from "../../utils/plans.js";

const SIMULATED_DELAY_MS = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SAMPLE_CATALOGUE = [
  {
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    attribution: '"Big Buck Bunny" © Blender Foundation, CC BY 3.0 (peach.blender.org)',
  },
  {
    type: "hls",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    attribution:
      '"Big Buck Bunny" © Blender Foundation, CC BY 3.0. HLS test stream provided by Mux',
  },
  {
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    attribution: '"Sintel" © Blender Foundation, CC BY 3.0 (durian.blender.org)',
  },
  {
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    attribution: '"Tears of Steel" © Blender Foundation, CC BY 3.0 (mango.blender.org)',
  },
  {
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    attribution: '"Elephants Dream" © Blender Foundation, CC BY 2.5 (orange.blender.org)',
  },
];

export async function getPlaybackSource(movieId) {
  await delay(SIMULATED_DELAY_MS);

  const normalizedId = String(movieId);
  const numericId = Number(normalizedId);
  if (!/^\d+$/.test(normalizedId) || !Number.isSafeInteger(numericId)) {
    throw new PlaybackError("INVALID_MOVIE", "That movie id isn't valid.");
  }

  const user = await authService.getCurrentUser();
  if (!user) {
    throw new PlaybackError("UNAUTHENTICATED", "Please log in to watch.");
  }

  const subscription = await subscriptionService.getSubscription(user.id);
  const requiredPlan = getRequiredPlan(numericId);

  if (!canAccess(subscription.plan, requiredPlan)) {
    throw new PlaybackError(
      "SUBSCRIPTION_REQUIRED",
      `This title needs the ${getPlanName(requiredPlan)} plan.`,
      { requiredPlan }
    );
  }

  const entry = SAMPLE_CATALOGUE[numericId % SAMPLE_CATALOGUE.length];
  return { ...entry, isDemo: true };
}
