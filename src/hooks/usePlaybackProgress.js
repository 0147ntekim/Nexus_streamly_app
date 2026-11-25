import { useCallback, useEffect, useRef, useState } from "react";
import { libraryService } from "../services/libraryService.js";

const SAVE_INTERVAL_MS = 10000;

// timeupdate fires frequently, so persist only at intervals and on forced saves.
export function usePlaybackProgress({ movie, userId }) {
  const latestRef = useRef(null);
  const lastSavedAtRef = useRef(0);
  const contextRef = useRef({ movie, userId });
  const isMountedRef = useRef(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    contextRef.current = { movie, userId };
  });

  const persist = useCallback(() => {
    const latest = latestRef.current;
    const { movie: currentMovie, userId: currentUserId } = contextRef.current;
    if (!latest || !currentMovie || !currentUserId) return;

    lastSavedAtRef.current = Date.now();
    libraryService
      .saveProgress(
        currentUserId,
        currentMovie,
        latest.currentTime,
        latest.duration
      )
      .then(() => {
        if (isMountedRef.current) setSaveError("");
      })
      .catch((error) => {
        if (isMountedRef.current) {
          setSaveError(
            error instanceof Error
              ? `Playback progress couldn't be saved: ${error.message}`
              : "Playback progress couldn't be saved."
          );
        }
      });
  }, []);

  const reportProgress = useCallback(
    ({ currentTime, duration, force = false }) => {
      if (!Number.isFinite(duration) || duration <= 0) return;
      latestRef.current = { currentTime, duration };

      if (force || Date.now() - lastSavedAtRef.current >= SAVE_INTERVAL_MS) {
        persist();
      }
    },
    [persist]
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      persist();
    };
  }, [persist]);

  return { reportProgress, saveError };
}
