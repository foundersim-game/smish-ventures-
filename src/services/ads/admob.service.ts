import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

export interface AdMobConfig {
  androidBannerId?: string;
  iosBannerId?: string;
  androidInterstitialId?: string;
  iosInterstitialId?: string;
  androidRewardedId?: string;
  iosRewardedId?: string;
  isTesting?: boolean;
}

// Live Production Google AdMob Unit IDs
const GOOGLE_ADMOB_DEFAULT_IDS = {
  android: {
    appId: "ca-app-pub-5887294790874355~8115758695",
    banner: "ca-app-pub-5887294790874355/6831520628",
    interstitial: "ca-app-pub-5887294790874355/1579193940",
    rewarded: "ca-app-pub-5887294790874355/6639948935",
  },
  ios: {
    appId: "ca-app-pub-5887294790874355~6602446603",
    banner: "ca-app-pub-5887294790874355/9452891091",
    interstitial: "ca-app-pub-5887294790874355/5901582332",
    rewarded: "ca-app-pub-5887294790874355/8336173989",
  },
};

export class AdMobService {
  private static isInitialized = false;
  private static isAdFreeActive = false;
  private static isBannerVisible = false;

  private static getBannerId(platform: string): string {
    if (platform === "ios") {
      return (
        process.env.NEXT_PUBLIC_ADMOB_BANNER_ID_IOS ||
        GOOGLE_ADMOB_DEFAULT_IDS.ios.banner
      );
    }
    return (
      process.env.NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID ||
      GOOGLE_ADMOB_DEFAULT_IDS.android.banner
    );
  }

  private static getInterstitialId(platform: string): string {
    if (platform === "ios") {
      return (
        process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS ||
        GOOGLE_ADMOB_DEFAULT_IDS.ios.interstitial
      );
    }
    return (
      process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
      GOOGLE_ADMOB_DEFAULT_IDS.android.interstitial
    );
  }

  private static getRewardedId(platform: string): string {
    if (platform === "ios") {
      return (
        process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID_IOS ||
        GOOGLE_ADMOB_DEFAULT_IDS.ios.rewarded
      );
    }
    return (
      process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID ||
      GOOGLE_ADMOB_DEFAULT_IDS.android.rewarded
    );
  }

  private static isTestingMode(): boolean {
    if (process.env.NEXT_PUBLIC_ADMOB_IS_TESTING !== undefined) {
      return process.env.NEXT_PUBLIC_ADMOB_IS_TESTING === "true";
    }
    return false;
  }

  public static async initialize(config?: AdMobConfig): Promise<void> {
    if (this.isInitialized) return;

    if (Capacitor.isNativePlatform()) {
      try {
        const isTesting = config?.isTesting ?? this.isTestingMode();
        if (Capacitor.getPlatform() === "ios") {
          try {
            await AdMob.requestTrackingAuthorization();
          } catch {
            // ATT request dismissed or not available
          }
        }
        await AdMob.initialize({
          initializeForTesting: isTesting,
        });
        console.log("[AdMobService] Real Google AdMob SDK initialized.");
      } catch (err) {
        console.warn("[AdMobService] Error initializing native AdMob:", err);
      }
    }

    this.isInitialized = true;
  }

  /**
   * Sets whether the current room or player is Ad-Free.
   * If true, suppresses all banners and interstitials immediately.
   */
  public static setAdFree(active: boolean): void {
    this.isAdFreeActive = active;
    if (active && this.isBannerVisible) {
      this.hideBanner();
    }
  }

  /**
   * Shows a native sticky bottom banner ad via Google AdMob.
   */
  public static async showBanner(): Promise<void> {
    if (this.isAdFreeActive) {
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const platform = Capacitor.getPlatform();
    const adId = this.getBannerId(platform);
    const isTesting = this.isTestingMode();

    try {
      await AdMob.showBanner({
        adId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting,
      });
      this.isBannerVisible = true;
    } catch (err) {
      console.warn("[AdMobService] Failed to show native banner:", err);
    }
  }

  /**
   * Hides the sticky banner ad.
   */
  public static async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.hideBanner();
      this.isBannerVisible = false;
    } catch (err) {
      console.warn("[AdMobService] Failed to hide native banner:", err);
    }
  }

  /**
   * Pre-loads an interstitial ad (e.g. before the Halftime break or Rematch).
   */
  public static async prepareInterstitial(): Promise<void> {
    if (this.isAdFreeActive || !Capacitor.isNativePlatform()) return;

    const platform = Capacitor.getPlatform();
    const adId = this.getInterstitialId(platform);
    const isTesting = this.isTestingMode();

    try {
      await AdMob.prepareInterstitial({
        adId,
        isTesting,
      });
    } catch (err) {
      console.warn("[AdMobService] Failed to prepare interstitial:", err);
    }
  }

  /**
   * Displays the full-screen interstitial ad (for Halftime or Rematch).
   */
  public static async showInterstitial(): Promise<boolean> {
    if (this.isAdFreeActive) {
      return false;
    }

    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      await AdMob.showInterstitial();
      return true;
    } catch (err) {
      console.warn("[AdMobService] Failed to show interstitial:", err);
      return false;
    }
  }

  /**
   * Shows a rewarded video ad.
   */
  public static async showRewarded(): Promise<boolean> {
    if (this.isAdFreeActive) {
      return true;
    }

    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    const platform = Capacitor.getPlatform();
    const adId = this.getRewardedId(platform);
    const isTesting = this.isTestingMode();

    try {
      await AdMob.prepareRewardVideoAd({ adId, isTesting });
      const result = await AdMob.showRewardVideoAd();
      return Boolean(result);
    } catch (err) {
      console.warn("[AdMobService] Failed to show rewarded ad:", err);
      return false;
    }
  }
}
