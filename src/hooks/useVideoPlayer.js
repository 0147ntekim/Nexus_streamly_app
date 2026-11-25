import { useEffect, useRef, useState } from "react";

const MIN_RESUME_SECONDS = 5;
const END_BUFFER_SECONDS = 10;

function getMediaErrorMessage(mediaError) {
  switch (mediaError?.code) {
    case 1:
      return "Playback was cancelled.";
    case 2:
      return "A network problem interrupted the video. Check your connection and try again.";
    case 3:
      return "This video couldn't be decoded. It may be damaged.";
    case 4:
      return "This video can't be played. It may be unavailable or in an unsupported format.";
    default:
      return "Something went wrong while playing this video.";
  }
}

function getBufferedEnd(video) {
  const { buffered, currentTime } = video;
  for (let index = 0; index < buffered.length; index += 1) {
    if (buffered.start(index) <= currentTime && currentTime <= buffered.end(index)) {
      return buffered.end(index);
    }
  }
  return 0;
}

export function useVideoPlayer({
  videoRef,
  containerRef,
  startTime = 0,
  onProgress,
  onEnded,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep the latest callbacks without reattaching media event listeners.
  const startTimeRef = useRef(startTime);
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // The video element is the source of truth; these listeners mirror it into React.
    function report(force = false) {
      onProgressRef.current?.({
        currentTime: video.currentTime,
        duration: video.duration,
        force,
      });
    }

    const handlers = {
      loadedmetadata() {
        setIsLoading(false);
        setDuration(video.duration);
        const resumeAt = startTimeRef.current;
        if (
          Number.isFinite(video.duration) &&
          resumeAt > MIN_RESUME_SECONDS &&
          resumeAt < video.duration - END_BUFFER_SECONDS
        ) {
          video.currentTime = resumeAt;
          setCurrentTime(resumeAt);
        }
      },
      durationchange() {
        setDuration(video.duration);
      },
      canplay() {
        setIsBuffering(false);
      },
      waiting() {
        setIsBuffering(true);
      },
      playing() {
        setIsPlaying(true);
        setIsBuffering(false);
      },
      play() {
        setIsPlaying(true);
      },
      pause() {
        setIsPlaying(false);
        report(true);
      },
      timeupdate() {
        setCurrentTime(video.currentTime);
        setBufferedEnd(getBufferedEnd(video));
        report();
      },
      progress() {
        setBufferedEnd(getBufferedEnd(video));
      },
      volumechange() {
        setVolume(video.volume);
        setIsMuted(video.muted);
      },
      ended() {
        setIsPlaying(false);
        onProgressRef.current?.({
          currentTime: video.duration,
          duration: video.duration,
          force: true,
        });
        onEndedRef.current?.();
      },
      error() {
        setError(getMediaErrorMessage(video.error));
      },
    };

    Object.entries(handlers).forEach(([eventName, handler]) => {
      video.addEventListener(eventName, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([eventName, handler]) => {
        video.removeEventListener(eventName, handler);
      });
    };
  }, [videoRef]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [containerRef]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((playError) => {
        if (playError.name !== "AbortError") {
          setError("Playback couldn't start. Please try again.");
        }
      });
    } else {
      video.pause();
    }
  }

  function seekTo(seconds) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const clamped = Math.min(Math.max(seconds, 0), video.duration);
    video.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function seekBy(deltaSeconds) {
    const video = videoRef.current;
    if (video) seekTo(video.currentTime + deltaSeconds);
  }

  function changeVolume(level) {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.min(Math.max(level, 0), 1);
    video.volume = clamped;
    video.muted = clamped === 0;
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted && video.volume === 0) video.volume = 0.5;
    video.muted = !video.muted;
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        setError("Fullscreen couldn't be closed. Try pressing Escape.");
      });
    } else if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {
        setError("Fullscreen isn't available in this browser.");
      });
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else {
      setError("Fullscreen isn't available in this browser.");
    }
  }

  function resetPlayback() {
    setError(null);
    setIsLoading(true);
    setIsBuffering(false);
  }

  return {
    isPlaying,
    currentTime,
    duration,
    bufferedEnd,
    volume,
    isMuted,
    isLoading,
    isBuffering,
    error,
    isFullscreen,
    togglePlay,
    seekTo,
    seekBy,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    resetPlayback,
  };
}
