const TRACK_SRC = "/audio/birthday.mp3";

export class AudioController {
  constructor(src = TRACK_SRC) {
    this.src = src;
    this.audio = null;
    this.enabled = false;
    this.available = true;
  }

  init() {
    if (this.audio) return;
    this.audio = new Audio(this.src);
    this.audio.loop = true;
    this.audio.volume = 0.5;
    this.audio.addEventListener("error", () => {
      this.available = false;
      this.enabled = false;
    });
  }

  async play() {
    if (!this.audio) this.init();
    if (!this.available) return;
    try {
      await this.audio.play();
      this.enabled = true;
    } catch {
      this.available = false;
      this.enabled = false;
    }
  }

  pause() {
    if (this.audio) this.audio.pause();
    this.enabled = false;
  }

  async toggle() {
    if (this.enabled) {
      this.pause();
    } else {
      await this.play();
    }
    return this.enabled;
  }
}
