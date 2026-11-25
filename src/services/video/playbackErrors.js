export class PlaybackError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "PlaybackError";
    this.code = code;
    this.details = details;
  }
}
