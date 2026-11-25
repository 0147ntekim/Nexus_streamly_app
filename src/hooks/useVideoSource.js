import { useEffect, useState } from "react";

export function useVideoSource(videoRef, source) {
  const [failure, setFailure] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return undefined;

    let hls = null;
    let isCancelled = false;

    function reportSourceError(message) {
      if (!isCancelled) setFailure({ source, attempt, message });
    }

    async function attachSource() {
      // Safari can play HLS natively; other browsers need the lazily loaded library.
      const needsHlsJs =
        source.type === "hls" &&
        !video.canPlayType("application/vnd.apple.mpegurl");

      if (!needsHlsJs) {
        video.src = source.url;
        return;
      }

      try {
        const { default: Hls } = await import("hls.js");
        if (isCancelled) return;

        if (!Hls.isSupported()) {
          reportSourceError("This browser can't play this type of video stream.");
          return;
        }

        hls = new Hls();
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            reportSourceError("The video stream failed to load. Please try again.");
          }
        });
        hls.loadSource(source.url);
        hls.attachMedia(video);
      } catch {
        reportSourceError("The video player component failed to load.");
      }
    }

    attachSource();

    return () => {
      isCancelled = true;
      if (hls) hls.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [videoRef, source, attempt]);

  function retry() {
    setAttempt((count) => count + 1);
  }

  const sourceError =
    failure?.source === source && failure.attempt === attempt
      ? failure.message
      : null;

  return { sourceError, retry };
}
