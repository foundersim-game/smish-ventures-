import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "lock"
  | "warning"
  | "success"
  | "selection"
  | "chaos_moment";

class HapticsManager {
  private static instance: HapticsManager;
  private isEnabled = true;

  private constructor() {}

  public static getInstance(): HapticsManager {
    if (!HapticsManager.instance) {
      HapticsManager.instance = new HapticsManager();
    }
    return HapticsManager.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public async trigger(type: HapticType): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // First try Capacitor Native Haptics
      switch (type) {
        case "light":
        case "selection":
          await Haptics.impact({ style: ImpactStyle.Light });
          return;
        case "medium":
          await Haptics.impact({ style: ImpactStyle.Medium });
          return;
        case "heavy":
        case "lock":
          await Haptics.impact({ style: ImpactStyle.Heavy });
          return;
        case "success":
          await Haptics.notification({ type: NotificationType.Success });
          return;
        case "warning":
          await Haptics.notification({ type: NotificationType.Warning });
          return;
        case "chaos_moment":
          await Haptics.vibrate({ duration: 400 });
          return;
      }
    } catch {
      // Fallback to browser Vibration API if Capacitor native bridge is unavailable
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        switch (type) {
          case "light":
            navigator.vibrate(10);
            break;
          case "medium":
            navigator.vibrate(20);
            break;
          case "lock":
            navigator.vibrate([15, 30, 20]);
            break;
          case "warning":
            navigator.vibrate([30, 40, 30]);
            break;
          case "chaos_moment":
            navigator.vibrate([100, 50, 200, 50, 400]);
            break;
          default:
            navigator.vibrate(15);
            break;
        }
      }
    }
  }
}

export const haptics = HapticsManager.getInstance();
