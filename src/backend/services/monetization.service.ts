import { RoomRepository } from "../repositories/room.repository";

export interface HostPassProduct {
  id: string;
  name: string;
  priceUsd: number;
  priceInr: number;
  priceDisplay: string;
  hostedGamesCount: number | "unlimited";
  durationDays?: number;
  description: string;
  popular?: boolean;
}

export const HOST_PASS_TIERS: HostPassProduct[] = [
  {
    id: "single_ad_free",
    name: "Single Ad-Free Game",
    priceUsd: 0.99,
    priceInr: 49,
    priceDisplay: "$0.99",
    hostedGamesCount: 1,
    description: "Remove all ads for everyone in this room tonight.",
  },
  {
    id: "pass_10_games",
    name: "10-Game Party Pass",
    priceUsd: 2.99,
    priceInr: 149,
    priceDisplay: "$2.99",
    hostedGamesCount: 10,
    description: "Host 10 ad-free games with full premium scenario access.",
    popular: true,
  },
  {
    id: "pass_30_games",
    name: "30-Game Squad Pass",
    priceUsd: 4.99,
    priceInr: 299,
    priceDisplay: "$4.99",
    hostedGamesCount: 30,
    description: "Host 30 games. Ideal for weekly game nights, fraternity houses & trips.",
  },
  {
    id: "pass_30_days_unlimited",
    name: "30-Day Unlimited CHAOS",
    priceUsd: 5.99,
    priceInr: 399,
    priceDisplay: "$5.99",
    hostedGamesCount: "unlimited",
    durationDays: 30,
    description: "Unlimited hosting & all premium scenario expansions for 30 days.",
  },
];

export class MonetizationService {
  private static repo = RoomRepository.getInstance();

  public static async isRoomAdEligible(roomCode: string): Promise<boolean> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return false;
    // Paid rooms are completely ad-free for the entire room
    return !room.isPaidSession;
  }

  public static async activateRoomHostPass(roomCode: string): Promise<void> {
    await this.repo.updateRoom(roomCode, { isPaidSession: true });
  }

  public static getPricingTiers(): HostPassProduct[] {
    return HOST_PASS_TIERS;
  }
}
