import { formatPlaybackTime } from "../../utils/formatters.js";
import styles from "./PlayerControls.module.css";

function PlayerControls({
  isVisible,
  isPlaying,
  currentTime,
  duration,
  bufferedEnd,
  volume,
  isMuted,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
}) {
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const playedPercent =
    safeDuration > 0
      ? Math.min((currentTime / safeDuration) * 100, 100)
      : 0;
  const bufferedPercent =
    safeDuration > 0
      ? Math.min((bufferedEnd / safeDuration) * 100, 100)
      : 0;
  const isSilent = isMuted || volume === 0;

  return (
    <div className={`${styles.controls} ${isVisible ? "" : styles.hidden}`}>
      <div className={styles.seek}>
        <div className={styles.track} aria-hidden="true">
          <div className={styles.buffered} style={{ width: `${bufferedPercent}%` }} />
          <div className={styles.played} style={{ width: `${playedPercent}%` }} />
        </div>
        <input
          type="range"
          className={styles.seekInput}
          min={0}
          max={safeDuration}
          step={0.1}
          value={Math.min(currentTime, safeDuration)}
          onChange={(event) => onSeek(Number(event.target.value))}
          disabled={safeDuration === 0}
          aria-label="Seek"
          aria-valuetext={`${formatPlaybackTime(currentTime)} of ${formatPlaybackTime(safeDuration)}`}
        />
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <span className={styles.time}>
          {formatPlaybackTime(currentTime)} / {formatPlaybackTime(safeDuration)}
        </span>

        <div className={styles.spacer} />

        <div className={styles.volume}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onToggleMute}
            aria-label={isSilent ? "Unmute" : "Mute"}
          >
            {isSilent ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            className={styles.volumeInput}
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label="Volume"
          />
        </div>

        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? "🗗" : "⛶"}
        </button>
      </div>
    </div>
  );
}

export default PlayerControls;
