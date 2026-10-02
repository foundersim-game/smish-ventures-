import { RoomRepository } from "../repositories/room.repository";

export interface HostPassProduct {
  id: string;
  name: string;
  priceInr: number;
  hostedGamesCount: number | "unlimited";
  durationDays?: number;
  description: string;
}

export const HOST_PASS_TIERS: HostPassProduct[] = [
  {
    id: "single_ad_free",
    name: "Ad-Free Single Game",
    priceInr: 49,
    hostedGamesCount: 1,
    description: "Remove all ads for everyone in this game session.",
  },
  {
    id: "pass_10_games",
    name: "10-Game Host Pass",
    priceInr: 149,
    hostedGamesCount: 10,
    description: "Host 10 ad-free games with full premium scenario access.",
  },
  {
    id: "pass_30_games",
    name: "30-Game Host Pass",
    priceInr: 299,
    hostedGamesCount: 30,
    description: "Host 30 games. Ideal for parties, trips and regular friend groups.",
  },
  {
    id: "pass_30_days_unlimited",
    name: "30-Day Unlimited CHAOS",
    priceInr: 399,
    hostedGamesCount: "unlimited",
    durationDays: 30,
    description: "Unlimited hosting, all premium content & Couples Mode for 30 days.",
  },
];

export class MonetizationService {
  private static repo = RoomRepository.getInstance();

  public static isRoomAdEligible(roomCode: string): boolean {
    const room = this.repo.findByCode(roomCode);
    if (!room) return false;
    // Paid rooms are completely ad-free for the entire room
    return !room.isPaidSession;
  }

  public static activateRoomHostPass(roomCode: string): void {
    this.repo.updateRoom(roomCode, { isPaidSession: true });
  }

  public static getPricingTiers(): HostPassProduct[] {
    return HOST_PASS_TIERS;
  }
}
