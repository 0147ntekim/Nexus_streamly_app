import { useEffect, useRef, useState } from "react";
import Button from "../common/Button.jsx";
import PlayerControls from "./PlayerControls.jsx";
import { useVideoPlayer } from "../../hooks/useVideoPlayer.js";
import { useVideoSource } from "../../hooks/useVideoSource.js";
import styles from "./VideoPlayer.module.css";

const CONTROLS_HIDE_DELAY_MS = 3000;
const SEEK_STEP_SECONDS = 10;
const VOLUME_STEP = 0.1;

function VideoPlayer({
  source,
  poster,
  title,
  startTime = 0,
  onProgress,
  onEnded,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [areControlsVisible, setAreControlsVisible] = useState(true);

  // Attach media listeners before useVideoSource sets video.src.
  const player = useVideoPlayer({
    videoRef,
    containerRef,
    startTime,
    onProgress,
    onEnded,
  });
  const { sourceError, retry } = useVideoSource(videoRef, source);

  const errorMessage = sourceError ?? player.error;
  const showSpinner =
    !errorMessage && (player.isLoading || player.isBuffering);
  const showBigPlay =
    !errorMessage &&
    !player.isLoading &&
    !player.isBuffering &&
    !player.isPlaying;

  function revealControls() {
    setAreControlsVisible(true);
    window.clearTimeout(hideTimerRef.current);
    if (player.isPlaying) {
      hideTimerRef.current = window.setTimeout(
        () => setAreControlsVisible(false),
        CONTROLS_HIDE_DELAY_MS
      );
    }
  }

  useEffect(() => {
    window.clearTimeout(hideTimerRef.current);
    if (player.isPlaying) {
      hideTimerRef.current = window.setTimeout(
        () => setAreControlsVisible(false),
        CONTROLS_HIDE_DELAY_MS
      );
    }
    return () => window.clearTimeout(hideTimerRef.current);
  }, [player.isPlaying]);

  function handleKeyDown(event) {
    if (event.target.closest("input, button")) return;

    switch (event.key) {
      case " ":
      case "k":
      case "K":
        event.preventDefault();
        player.togglePlay();
        break;
      case "ArrowRight":
        event.preventDefault();
        player.seekBy(SEEK_STEP_SECONDS);
        break;
      case "ArrowLeft":
        event.preventDefault();
        player.seekBy(-SEEK_STEP_SECONDS);
        break;
      case "ArrowUp":
        event.preventDefault();
        player.changeVolume(player.volume + VOLUME_STEP);
        break;
      case "ArrowDown":
        event.preventDefault();
        player.changeVolume(player.volume - VOLUME_STEP);
        break;
      case "m":
      case "M":
        event.preventDefault();
        player.toggleMute();
        break;
      case "f":
      case "F":
        event.preventDefault();
        player.toggleFullscreen();
        break;
      default:
        return;
    }
    revealControls();
  }

  function handleRetry() {
    player.resetPlayback();
    retry();
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${title}`}
      onKeyDown={handleKeyDown}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      onFocus={revealControls}
    >
      <video
        ref={videoRef}
        className={styles.video}
        poster={poster ?? undefined}
        preload="metadata"
        playsInline
        aria-label={title}
        onClick={player.togglePlay}
        onDoubleClick={player.toggleFullscreen}
      />

      {showSpinner && (
        <div className={styles.overlay}>
          <div className={styles.spinner} role="status">
            <span className="sr-only">Loading video...</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className={styles.overlay}>
          <div className={styles.errorBox} role="alert">
            <p>{errorMessage}</p>
            <Button variant="secondary" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {showBigPlay && (
        <button
          type="button"
          className={styles.bigPlay}
          onClick={player.togglePlay}
          aria-label="Play video"
        >
          ▶
        </button>
      )}

      <PlayerControls
        isVisible={(!player.isPlaying || areControlsVisible) && !errorMessage}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        duration={player.duration}
        bufferedEnd={player.bufferedEnd}
        volume={player.volume}
        isMuted={player.isMuted}
        isFullscreen={player.isFullscreen}
        onTogglePlay={player.togglePlay}
        onSeek={player.seekTo}
        onToggleMute={player.toggleMute}
        onVolumeChange={player.changeVolume}
        onToggleFullscreen={player.toggleFullscreen}
      />
    </div>
  );
}

export default VideoPlayer;
