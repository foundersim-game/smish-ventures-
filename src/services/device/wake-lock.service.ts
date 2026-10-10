/**
 * Screen Wake Lock Service
 * Keeps phones awake during heated 60-90s group discussions and voting phases
 * so the phone screen doesn't dim or lock mid-game.
 */
export class WakeLockService {
  private static sentinel: any = null;
  private static isRequested = false;
  private static isListenerAttached = false;

  public static async request(): Promise<void> {
    this.isRequested = true;

    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    if (!this.isListenerAttached) {
      this.isListenerAttached = true;
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && this.isRequested) {
          this.acquireLock();
        }
      });
    }

    await this.acquireLock();
  }

  private static async acquireLock(): Promise<void> {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        if (this.sentinel && !this.sentinel.released) {
          return;
        }

        const wakeLockNav = navigator as unknown as {
          wakeLock: { request: (type: "screen") => Promise<any> };
        };

        this.sentinel = await wakeLockNav.wakeLock.request("screen");
        this.sentinel.addEventListener("release", () => {
          this.sentinel = null;
          if (this.isRequested && document.visibilityState === "visible") {
            // Re-acquire if screen locked involuntarily (e.g. tab minimized & restored)
            setTimeout(() => this.acquireLock(), 500);
          }
        });
      } catch {
        // Can fail if battery saver is engaged or permission denied
      }
    }
  }

  public static release(): void {
    this.isRequested = false;
    if (this.sentinel) {
      try {
        this.sentinel.release();
      } catch {
        // Ignore
      }
      this.sentinel = null;
    }
  }
}
