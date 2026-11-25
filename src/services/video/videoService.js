/**
 * The ONLY video module the rest of the app imports.
 *
 * This currently delegates to the demo provider. In production, a backend
 * should authenticate the user, check access, then return a signed,
 * time-limited playback URL. Provider signing keys must remain on the server,
 * never in this frontend; switch providers here without changing the player.
 */
export { getPlaybackSource } from "./sampleVideoProvider.js";
